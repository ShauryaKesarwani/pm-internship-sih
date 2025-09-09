from pymongo import MongoClient
import os

# Example using environment variable for connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["don-tByteMe"]   # database
users_collection = db["users"] # collection
