const express = require("express")
const { MongoClient } = require("mongodb")
const path = require("path")
const cors = require("cors")
const { ObjectId } = require('mongodb');

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://admin:Pk%402006@cluster0.eml0c.mongodb.net/vulnova?retryWrites=true&w=majority&appName=Cluster0"

let db

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("."))

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URL)
    await client.connect()
    db = client.db("vulnova") // Explicitly specify database name
    console.log("Connected to MongoDB Atlas successfully")
    console.log("Database: vulnova")
    console.log("Required collections: vulnerabilities, assets, threat_intelligence")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// API Routes

// Get dashboard summary data
app.get("/api/dashboard-summary", async (req, res) => {
  try {
    const criticalCount = await db.collection("vulnerabilities").countDocuments({ severity: "Critical" })
    const highCount = await db.collection("vulnerabilities").countDocuments({ severity: "High" })
    const mediumCount = await db.collection("vulnerabilities").countDocuments({ severity: "Medium" })
    const lowCount = await db.collection("vulnerabilities").countDocuments({ severity: "Low" })

    // Calculate risk score based on vulnerabilities
    const riskScore = Math.min(1000, criticalCount * 8 + highCount * 2 + mediumCount * 0.5 + lowCount * 0.1)

    let riskStatus = "Low Risk"
    if (riskScore > 700) riskStatus = "High Risk"
    else if (riskScore > 300) riskStatus = "Medium Risk"

    res.json({
      riskScore: Math.round(riskScore),
      riskStatus,
      vulnerabilities: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard summary:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get riskiest assets
app.get("/api/riskiest-assets", async (req, res) => {
  try {
    const assets = await db.collection("assets").find({}).sort({ riskScore: -1 }).limit(5).toArray()

    res.json(assets)
  } catch (error) {
    console.error("Error fetching riskiest assets:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get threat intelligence
app.get("/api/threat-intelligence", async (req, res) => {
  try {
    const threats = await db.collection("threat_intelligence").find({}).sort({ date: -1 }).limit(3).toArray()

    res.json(threats)
  } catch (error) {
    console.error("Error fetching threat intelligence:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})


// Get all integrations
app.get("/api/integrations", async (req, res) => {
  try {
    const integrations = await db.collection("integrations").find({}).toArray();
    res.json(integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get active integrations
app.get("/api/integrations/active", async (req, res) => {
  try {
    const integrations = await db.collection("integrations")
      .find({ status: "active" })
      .sort({ lastSync: -1 })
      .toArray();
    res.json(integrations);
  } catch (error) {
    console.error("Error fetching active integrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get available integrations
app.get("/api/integrations/available", async (req, res) => {
  try {
    const integrations = await db.collection("integrations")
      .find({ status: { $ne: "active" } })
      .toArray();
    res.json(integrations);
  } catch (error) {
    console.error("Error fetching available integrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add these new routes to your server.js file after the existing routes

// Get all assets with pagination and filtering
app.get("/api/asset", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query = {};
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { ipAddress: { $regex: req.query.search, $options: 'i' } },
        { hostname: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.os) {
      query.os = { $regex: req.query.os, $options: 'i' };
    }
    
    if (req.query.riskLevel) {
      query.riskLevel = req.query.riskLevel;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.edrInstalled) {
      query.edrInstalled = req.query.edrInstalled === 'true';
    }

    const assets = await db.collection("asset")
      .find(query)
      .sort({ riskScore: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("asset").countDocuments(query);

    res.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get asset summary statistics
app.get("/api/assets/summary", async (req, res) => {
  try {
    const totalAssets = await db.collection("asset").countDocuments();
    const activeAssets = await db.collection("asset").countDocuments({ status: "Online" });
    const highRiskAssets = await db.collection("asset").countDocuments({ riskLevel: { $in: ["Critical", "High"] } });
    const unprotectedAssets = await db.collection("asset").countDocuments({ edrInstalled: false });
    
    // Get asset counts by category
    const categoryCounts = await db.collection("asset").aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // Get asset counts by OS
    const osCounts = await db.collection("asset").aggregate([
      { $group: { _id: "$os", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // Get security status counts
    const securityStatus = await db.collection("asset").aggregate([
      { 
        $group: { 
          _id: { 
            $cond: [
              { $eq: ["$edrInstalled", true] },
              "Protected",
              "Unprotected"
            ] 
          },
          count: { $sum: 1 } 
        } 
      }
    ]).toArray();

    res.json({
      totalAssets,
      activeAssets,
      highRiskAssets,
      unprotectedAssets,
      categoryCounts,
      osCounts,
      securityStatus
    });
  } catch (error) {
    console.error("Error fetching asset summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single asset by ID
app.get("/api/asset/:id", async (req, res) => {
  try {
    const asset = await db.collection("asset")
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    res.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new asset
app.post("/api/asset", async (req, res) => {
  try {
    const { name, ipAddress, hostname, category, os } = req.body;
    
    // Basic validation
    if (!name || !ipAddress || !hostname || !category || !os) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Calculate initial risk score (can be updated later by scans)
    const initialRiskScore = Math.floor(Math.random() * 500) + 100;
    let riskLevel = "Low";
    if (initialRiskScore >= 800) riskLevel = "Critical";
    else if (initialRiskScore >= 600) riskLevel = "High";
    else if (initialRiskScore >= 300) riskLevel = "Medium";

    const result = await db.collection("asset").insertOne({
      name,
      ipAddress,
      hostname,
      category,
      os,
      riskScore: initialRiskScore,
      riskLevel,
      vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
      lastSeen: new Date().toISOString(),
      status: "Online",
      location: "Unknown",
      owner: "Unassigned",
      edrInstalled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ 
      success: true, 
      id: result.insertedId,
      message: "Asset created successfully"
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update asset
app.put("/api/asset/:id", async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove immutable fields
    delete updates._id;
    delete updates.createdAt;
    
    updates.updatedAt = new Date();
    
    const result = await db.collection("asset").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    res.json({ success: true, message: "Asset updated successfully" });
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete asset
app.delete("/api/assets/:id", async (req, res) => {
  try {
    const result = await db.collection("asset").deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    res.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Scan asset
app.post("/api/asset/:id/scan", async (req, res) => {
  try {
    // In a real implementation, this would trigger an actual scan
    // For demo purposes, we'll simulate a scan with random results
    
    const asset = await db.collection("asset").findOne(
      { _id: new ObjectId(req.params.id) }
    );
    
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    
    // Simulate scan results
    const newRiskScore = Math.floor(Math.random() * 1000);
    let riskLevel = "Low";
    if (newRiskScore >= 800) riskLevel = "Critical";
    else if (newRiskScore >= 600) riskLevel = "High";
    else if (newRiskScore >= 300) riskLevel = "Medium";

    const critical = Math.floor(Math.random() * (riskLevel === "Critical" ? 15 : riskLevel === "High" ? 8 : 3));
    const high = Math.floor(Math.random() * (riskLevel === "Critical" ? 20 : riskLevel === "High" ? 15 : 8));
    const medium = Math.floor(Math.random() * 30);
    const low = Math.floor(Math.random() * 40);

    await db.collection("asset").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { 
        riskScore: newRiskScore,
        riskLevel,
        vulnerabilities: { critical, high, medium, low },
        lastSeen: new Date().toISOString(),
        status: "Online",
        updatedAt: new Date()
      } }
    );
    
    res.json({ 
      success: true,
      message: "Scan completed successfully",
      scanResults: {
        riskScore: newRiskScore,
        riskLevel,
        vulnerabilities: { critical, high, medium, low }
      }
    });
  } catch (error) {
    console.error("Error scanning asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single integration
app.get("/api/integrations/:id", async (req, res) => {
  try {
    const integration = await db.collection("integrations")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }
    res.json(integration);
  } catch (error) {
    console.error("Error fetching integration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update integration status
app.put("/api/integrations/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection("integrations").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating integration status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all automation rules
app.get("/api/automation-rules", async (req, res) => {
  try {
    const rules = await db.collection("automation_rules").find({}).toArray();
    res.json(rules);
  } catch (error) {
    console.error("Error fetching automation rules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single automation rule
app.get("/api/automation-rules/:id", async (req, res) => {
  try {
    const rule = await db.collection("automation_rules")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }
    res.json(rule);
  } catch (error) {
    console.error("Error fetching automation rule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update automation rule status
app.put("/api/automation-rules/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection("automation_rules").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating rule status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete automation rule
app.delete("/api/automation-rules/:id", async (req, res) => {
  try {
    await db.collection("automation_rules").deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting rule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new automation rule
app.post("/api/automation-rules", async (req, res) => {
  try {
    const { name, trigger, action } = req.body;
    const result = await db.collection("automation_rules").insertOne({
      name,
      trigger,
      action,
      status: "active",
      lastTriggered: null,
      createdAt: new Date()
    });
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error creating automation rule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get assets missing EDR
app.get("/api/assets-missing-edr", async (req, res) => {
  try {
    const assets = await db.collection("assets").find({ hasEDR: false }).limit(10).toArray()

    res.json({
      count: await db.collection("assets").countDocuments({ hasEDR: false }),
      assets: assets.map((asset) => asset.name),
    })
  } catch (error) {
    console.error("Error fetching assets missing EDR:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})


// Get assets not scanned
app.get("/api/assets-not-scanned", async (req, res) => {
  try {
    const assets = await db.collection("assets").find({ lastScanned: null }).limit(10).toArray()

    res.json({
      count: await db.collection("assets").countDocuments({ lastScanned: null }),
      assets: assets.map((asset) => asset.name),
    })
  } catch (error) {
    console.error("Error fetching assets not scanned:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all vulnerabilities with pagination
app.get("/api/vulnerabilities", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const severity = req.query.severity
    const skip = (page - 1) * limit

    const query = {}
    if (severity) {
      query.severity = severity
    }

    const vulnerabilities = await db
      .collection("vulnerabilities")
      .find(query)
      .sort({ cvssScore: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("vulnerabilities").countDocuments(query)

    res.json({
      vulnerabilities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error)
    res.status(500).json({ error: "Internal server error" })
  }

  
})


// Add these to your server.js after the other routes

// Reporting API Endpoints

// Get all reports with pagination and filtering
app.get("/api/reports", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query = {};
    
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.format) {
      query.format = req.query.format;
    }
    
    if (req.query.startDate && req.query.endDate) {
      query.generated = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const reports = await db.collection("reports")
      .find(query)
      .sort({ generated: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("reports").countDocuments(query);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get report by ID
app.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await db.collection("reports")
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new report
app.post("/api/reports", async (req, res) => {
  try {
    const { name, type, format, parameters, generatedBy } = req.body;
    
    // Basic validation
    if (!name || !type || !format) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newReport = {
      name,
      type,
      format,
      parameters: parameters || {},
      status: "In Progress",
      size: "-",
      generated: new Date().toISOString(),
      createdAt: new Date(),
      createdBy: generatedBy || "system",
      content: ""
    };

    const result = await db.collection("reports").insertOne(newReport);

    // In a real implementation, you would trigger report generation here
    // For demo, we'll simulate it with a timeout
    setTimeout(async () => {
      const size = `${(Math.random() * 10 + 1).toFixed(1)} MB`;
      await db.collection("reports").updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            status: "Completed",
            size,
            content: "Base64 encoded content or S3 path"
          } 
        }
      );
    }, 5000);

    res.json({ 
      success: true, 
      id: result.insertedId,
      message: "Report generation started"
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Download report content
app.get("/api/reports/:id/download", async (req, res) => {
  try {
    const report = await db.collection("reports")
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    if (report.status !== "Completed") {
      return res.status(400).json({ error: "Report not ready for download" });
    }
    
    // In a real implementation, you would stream the file content
    // For demo, we'll just return the info
    res.json({
      name: report.name,
      type: report.type,
      format: report.format,
      size: report.size,
      downloadUrl: `/reports/download/${report._id}.${report.format.toLowerCase()}`
    });
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get report templates
app.get("/api/report-templates", async (req, res) => {
  try {
    const templates = await db.collection("report_templates").find({}).toArray();
    res.json(templates);
  } catch (error) {
    console.error("Error fetching report templates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule report
app.post("/api/reports/schedule", async (req, res) => {
  try {
    const { templateId, schedule, recipients, parameters } = req.body;
    
    // Basic validation
    if (!templateId || !schedule) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const template = await db.collection("report_templates")
      .findOne({ _id: new ObjectId(templateId) });
    
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    const scheduledReport = {
      templateId: template._id,
      name: `Scheduled ${template.name}`,
      type: template.type,
      schedule,
      recipients: recipients || [],
      parameters: parameters || {},
      status: "Scheduled",
      lastRun: null,
      nextRun: calculateNextRun(schedule),
      createdAt: new Date(),
      createdBy: req.user?.email || "system"
    };

    const result = await db.collection("scheduled_reports").insertOne(scheduledReport);

    res.json({ 
      success: true, 
      id: result.insertedId,
      message: "Report scheduled successfully",
      nextRun: scheduledReport.nextRun
    });
  } catch (error) {
    console.error("Error scheduling report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 

// Add these to your server.js after the other routes

// Threat Intelligence API Endpoints

// Get recent threats
app.get('/api/threat-intelligence/recent', async (req, res) => {
  try {
    const threats = await db.collection('threat_intelligence')
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    res.json(threats);
  } catch (error) {
    console.error('Error fetching recent threats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get CVE alerts
app.get('/api/threat-intelligence/cves', async (req, res) => {
  try {
    const cves = await db.collection('cve_alerts')
      .find({})
      .sort({ published: -1 })
      .limit(5)
      .toArray();
    res.json(cves);
  } catch (error) {
    console.error('Error fetching CVE alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threat actors
app.get('/api/threat-intelligence/actors', async (req, res) => {
  try {
    const actors = await db.collection('threat_actors')
      .find({})
      .sort({ last_activity: -1 })
      .limit(3)
      .toArray();
    res.json(actors);
  } catch (error) {
    console.error('Error fetching threat actors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get IOCs with filtering
app.get('/api/threat-intelligence/iocs', async (req, res) => {
  try {
    const { search, type, severity } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { value: { $regex: search, $options: 'i' } },
        { threat: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    if (severity) {
      query.severity = severity;
    }

    const iocs = await db.collection('iocs')
      .find(query)
      .sort({ first_seen: -1 })
      .limit(50)
      .toArray();
    res.json(iocs);
  } catch (error) {
    console.error('Error fetching IOCs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Block an IOC
app.post('/api/threat-intelligence/iocs/:id/block', async (req, res) => {
  try {
    const result = await db.collection('iocs').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { blocked: true, updated_at: new Date() } }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'IOC not found' });
    }
    
    res.json({ success: true, message: 'IOC blocked successfully' });
  } catch (error) {
    console.error('Error blocking IOC:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threat stats
app.get('/api/threat-intelligence/stats', async (req, res) => {
  try {
    const criticalThreats = await db.collection('threat_intelligence')
      .countDocuments({ severity: 'Critical', timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    const totalIOCs = await db.collection('iocs').countDocuments();
    const newIOCs = await db.collection('iocs')
      .countDocuments({ first_seen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    const activeFeeds = await db.collection('threat_feeds')
      .countDocuments({ status: 'active' });
    
    const blockedThreats = await db.collection('iocs')
      .countDocuments({ blocked: true, updated_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    
    res.json({
      threat_level: criticalThreats > 0 ? 'Critical' : 'High',
      iocs_tracked: totalIOCs,
      new_iocs: newIOCs,
      active_feeds: activeFeeds,
      blocked_threats: blockedThreats,
      block_success_rate: 98.7
    });
  } catch (error) {
    console.error('Error fetching threat stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Support API Endpoints

// Get all support tickets
app.get('/api/support/tickets', async (req, res) => {
  try {
    const tickets = await db.collection('supportTickets')
      .find({})
      .sort({ created: -1 })
      .toArray();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ticket by ID
app.get('/api/support/tickets/:id', async (req, res) => {
  try {
    const ticket = await db.collection('supportTickets')
      .findOne({ id: req.params.id });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new ticket
app.post('/api/support/tickets', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    
    if (!title || !description || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      priority,
      status: 'Open',
      created: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      createdBy: req.user?.username || 'anonymous'
    };

    const result = await db.collection('supportTickets').insertOne(newTicket);
    
    res.status(201).json({
      success: true,
      id: newTicket.id,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket status
app.put('/api/support/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await db.collection('supportTickets').updateOne(
      { id: req.params.id },
      { $set: { status, lastUpdate: new Date().toISOString() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json({ success: true, message: 'Ticket status updated' });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system status
app.get('/api/support/status', async (req, res) => {
  try {
    const status = await db.collection('systemStatus')
      .find({})
      .sort({ service: 1 })
      .toArray();
    res.json(status);
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get knowledge base articles
app.get('/api/support/knowledge-base', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const articles = await db.collection('knowledgeBaseArticles')
      .find(query)
      .sort({ lastUpdated: -1 })
      .toArray();
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching knowledge base articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get knowledge base article by ID
app.get('/api/support/knowledge-base/:id', async (req, res) => {
  try {
    const article = await db.collection('knowledgeBaseArticles')
      .findOne({ id: parseInt(req.params.id) });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment view count
    await db.collection('knowledgeBaseArticles').updateOne(
      { id: parseInt(req.params.id) },
      { $inc: { views: 1 } }
    );
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate next run time
function calculateNextRun(schedule) {
  // This would be more sophisticated in a real implementation
  const now = new Date();
  switch (schedule.frequency) {
    case 'daily':
      return new Date(now.setDate(now.getDate() + 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return new Date(now.setHours(now.getHours() + 1));
  }
}

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Start server
async function startServer() {
  await connectToMongoDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
