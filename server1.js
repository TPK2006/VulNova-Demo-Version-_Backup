const express = require("express")
const { MongoClient } = require("mongodb")
const path = require("path")
const cors = require("cors")
const { ObjectId } = require("mongodb")

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://admin:Pk%402006@cluster0.eml0c.mongodb.net/vulnova?retryWrites=true&w=majority&appName=Cluster0"

// Gemini AI Configuration
const GEMINI_API_KEY ='AIzaSyB7duLPJ7eIUsv7wenkwAliNNEvfTGYIeM'

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
    db = client.db("vulnova")
    console.log("Connected to MongoDB Atlas successfully")
    console.log("Database: vulnova")
    console.log("Required collections: vulnerability, assets, threat_intelligence")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// AI-Powered Vulnerability Search
app.post("/api/vulnerability/ai-search", async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: "Search query is required" })
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" })
    }

    // Call Gemini AI to interpret the natural language query
    const aiResponse = await callGeminiAI(query)

    if (!aiResponse.success) {
      return res.status(500).json({ error: "AI processing failed" })
    }

    // Build MongoDB query based on AI interpretation
    const mongoQuery = buildMongoQuery(aiResponse.filters)

    // Execute the query
    const vulnerabilities = await db
      .collection("vulnerability")
      .find(mongoQuery)
      .sort({ priorityScore: -1 })
      .limit(50)
      .toArray()

    const totalResults = await db.collection("vulnerability").countDocuments(mongoQuery)

    res.json({
      success: true,
      filters: aiResponse.filters,
      vulnerability: vulnerabilities,
      totalResults,
      interpretation: aiResponse.interpretation,
      pagination: {
        page: 1,
        limit: 50,
        total: totalResults,
        pages: Math.ceil(totalResults / 50),
      },
    })
  } catch (error) {
    console.error("AI Search Error:", error)
    res.status(500).json({ error: "Internal server error during AI search" })
  }
})

async function callGeminiAI(userQuery) {
  try {
    const prompt = `
You are a cybersecurity expert helping to interpret natural language queries for vulnerability database searches. 
Convert the following user query into structured filters for a vulnerability database.

User Query: "${userQuery}"

Available vulnerability fields and their possible values:
- severity: "Critical", "High", "Medium", "Low"
- source: "Tenable", "Wiz", "Bitsight", "SonarQube", "Jamf", "SCCM", "Orca Security", "Qualys"
- status: "Open", "In Progress", "Resurfaced", "False Positive"
- exploitAvailable: true/false
- vulnerability (type): "SQL Injection", "Remote Code Execution", "Authentication Bypass", "Privilege Escalation", "Command Injection", "Buffer Overflow", "Cross-Site Scripting", "Memory Corruption", etc.
- assetName: any string (for asset names like "Server-001", "WebServer-005", etc.)
- ipAddress: IP address patterns
- mitreTactic: MITRE ATT&CK tactics like "Initial Access", "Execution", "Persistence", "Privilege Escalation", etc.

Please respond with a JSON object containing:
{
  "success": true,
  "filters": {
    // Only include filters that are relevant to the query
    // Use exact field names and values from the list above
  },
  "interpretation": "Brief explanation of how you interpreted the query"
}

Examples:
Query: "Show me critical vulnerabilities with exploits"
Response: {
  "success": true,
  "filters": {
    "severity": "Critical",
    "exploitAvailable": true
  },
  "interpretation": "Looking for Critical severity vulnerabilities that have known exploits available"
}

Query: "Find SQL injection vulnerabilities on web servers"
Response: {
  "success": true,
  "filters": {
    "vulnerability": "SQL Injection",
    "search": "WebServer"
  },
  "interpretation": "Searching for SQL Injection vulnerabilities on assets with 'WebServer' in their name"
}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Try to parse the JSON response from Gemini
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0])
        return aiResponse
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
    }

    // Fallback: create a simple search filter
    return {
      success: true,
      filters: {
        search: userQuery,
      },
      interpretation: `Performing general search for: ${userQuery}`,
    }
  } catch (error) {
    console.error("Error calling Gemini AI:", error)

    // Fallback response
    return {
      success: true,
      filters: {
        search: userQuery,
      },
      interpretation: `Performing general search for: ${userQuery} (AI unavailable)`,
    }
  }
}

function buildMongoQuery(filters) {
  const query = {}

  // Handle different filter types
  if (filters.severity) {
    query.severity = filters.severity
  }

  if (filters.source) {
    query.source = filters.source
  }

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.exploitAvailable !== undefined) {
    query.exploitAvailable = filters.exploitAvailable
  }

  if (filters.vulnerability) {
    query.vulnerability = { $regex: filters.vulnerability, $options: "i" }
  }

  if (filters.search) {
    query.$or = [
      { assetName: { $regex: filters.search, $options: "i" } },
      { ipAddress: { $regex: filters.search, $options: "i" } },
      { vulnerability: { $regex: filters.search, $options: "i" } },
      { cve: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  if (filters.mitreTactic) {
    query.mitreTactic = { $regex: filters.mitreTactic, $options: "i" }
  }

  return query
}

// Get dashboard summary
app.get("/api/dashboard-summary", async (req, res) => {
  try {
    const criticalCount = await db.collection("vulnerability").countDocuments({ severity: "Critical" })
    const highCount = await db.collection("vulnerability").countDocuments({ severity: "High" })
    const mediumCount = await db.collection("vulnerability").countDocuments({ severity: "Medium" })
    const lowCount = await db.collection("vulnerability").countDocuments({ severity: "Low" })

    // Calculate average riskScore from assets collection
    const avgRiskResult = await db
      .collection("assets")
      .aggregate([{ $group: { _id: null, avgRisk: { $avg: "$riskScore" } } }])
      .toArray()

    const riskScore =
      avgRiskResult.length > 0
        ? Math.floor(avgRiskResult[0].avgRisk)
        : Math.floor(Math.min(1000, criticalCount * 8 + highCount * 2 + mediumCount * 0.5 + lowCount * 0.1))

    let riskStatus = "Low Risk"
    if (riskScore > 700) riskStatus = "High Risk"
    else if (riskScore > 300) riskStatus = "Medium Risk"

    res.json({
      riskScore,
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

// Get all vulnerability with filters
app.get("/api/vulnerability", async (req, res) => {
  try {
    const {
      search,
      severity,
      status,
      source,
      exploitAvailable,
      mitreTactic,
      page = 1,
      limit = 50,
      sortField = "priorityScore",
      sortOrder = "desc",
    } = req.query

    const query = {}

    if (search) {
      query.$or = [
        { assetName: { $regex: search, $options: "i" } },
        { ipAddress: { $regex: search, $options: "i" } },
        { vulnerability: { $regex: search, $options: "i" } },
        { cve: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (severity) {
      query.severity = severity
    }

    if (status) {
      query.status = status
    }

    if (source) {
      query.source = source
    }

    if (exploitAvailable) {
      query.exploitAvailable = exploitAvailable === "true"
    }

    if (mitreTactic) {
      query.mitreTactic = { $regex: mitreTactic, $options: "i" }
    }

    const sortOptions = {}
    sortOptions[sortField] = sortOrder === "desc" ? -1 : 1

    const vulnerability = await db
      .collection("vulnerability")
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .toArray()

    const total = await db.collection("vulnerability").countDocuments(query)

    res.json({
      vulnerability,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching vulnerability:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

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

