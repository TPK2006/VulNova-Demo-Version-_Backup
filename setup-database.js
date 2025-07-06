const { MongoClient } = require("mongodb")
const fs = require("fs")

const MONGODB_URL =
  "mongodb+srv://admin:Pk%402006@cluster0.eml0c.mongodb.net/vulnova?retryWrites=true&w=majority&appName=Cluster0"

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URL)

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas successfully")

    const db = client.db("vulnova")

    // Create collections if they don't exist
// Modify the collections array in setup-database.js to include:
const collections = ["vulnerabilities", "assets", "asset","threat_intelligence", "integrations", "automation_rules", "reports","threat_intelligence", 
  "cve_alerts", 
  "threat_actors",
  "iocs",
  "threat_feeds","supportTickets",
  "systemStatus",
  "knowledgeBaseArticles"];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`✓ Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`✓ Collection already exists: ${collectionName}`)
        } else {
          console.error(`Error creating collection ${collectionName}:`, error.message)
        }
      }
    }

    // Import sample data
    const data = JSON.parse(fs.readFileSync("vulnova-data.json", "utf8"))

    // Clear existing data and insert new data
    await db.collection("vulnerabilities").deleteMany({})
    await db.collection("assets").deleteMany({})
    await db.collection("threat_intelligence").deleteMany({})

    await db.collection("vulnerabilities").insertMany(data.vulnerabilities)
    console.log(`✓ Inserted ${data.vulnerabilities.length} vulnerabilities`)

    await db.collection("assets").insertMany(data.assets)
    console.log(`✓ Inserted ${data.assets.length} assets`)

    await db.collection("threat_intelligence").insertMany(data.threat_intelligence)
    console.log(`✓ Inserted ${data.threat_intelligence.length} threat intelligence records`)

    // Create indexes for better performance
    await db.collection("vulnerabilities").createIndex({ severity: 1 })
    await db.collection("vulnerabilities").createIndex({ cvssScore: -1 })
    await db.collection("assets").createIndex({ riskScore: -1 })
    await db.collection("assets").createIndex({ hasEDR: 1 })
    await db.collection("assets").createIndex({ lastScanned: 1 })


    console.log("✓ Created database indexes")
    console.log("\n🎉 Database setup completed successfully!")
    console.log("\nDatabase: vulnova")
    console.log("Collections created:")
    console.log("  - vulnerabilities")
    console.log("  - assets")
    console.log("  - threat_intelligence")
  } catch (error) {
    console.error("Database setup error:", error)
  } finally {
    await client.close()
  }
}

db.assets.updateMany(
  { vulnerabilities: { $exists: false } },
  { $set: { vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 } } }
)

setupDatabase()
