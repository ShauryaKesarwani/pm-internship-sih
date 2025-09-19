from db import db, internships_collection

print("✅ Connected DB:", db.name)
print("📦 Collections:", db.list_collection_names())

count = internships_collection.count_documents({})
print("📊 Internship docs:", count)

doc = internships_collection.find_one()
print("📝 Sample doc:", doc)
