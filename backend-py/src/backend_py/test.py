import torch
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("google/embeddinggemma-300m")
emb = model.encode("Hello world")
print(emb.shape)
