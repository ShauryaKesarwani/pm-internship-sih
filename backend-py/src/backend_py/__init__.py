from sentence_transformers import SentenceTransformer, util

# Load the model (make sure you’re logged in to Hugging Face)
model = SentenceTransformer("google/embeddinggemma-300m")

# Example input
query = "Which on of these is Javascript?"
documents = [
    "Java",
    "JS",
    "Julia",
    "Ecmascript",
    "Cpp",
    "Python",
    "Typescript"
]

# Inference
query_embedding = model.encode_query(query, convert_to_tensor=True)
document_embeddings = model.encode_document(documents, convert_to_tensor=True)

# Compute cosine similarities
cos_scores = util.cos_sim(query_embedding, document_embeddings)[0]

# Print results
print("\nQuery:", query)
print("\nDocuments and similarity scores:")
for doc, score in zip(documents, cos_scores):
    print(f"  {doc}  -->  Score: {score.item():.4f}")

# Best match
best_idx = cos_scores.argmax().item()
print("\nBest Match:")
print(f"  {documents[best_idx]}")