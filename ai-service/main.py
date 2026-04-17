from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI(title="Giftura AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {"id": "1", "name": "Birthday Hamper Deluxe",    "occasion": "birthday",    "tags": "hamper birthday luxury chocolate", "price": 1840},
    {"id": "2", "name": "Anniversary Crystal Set",   "occasion": "anniversary", "tags": "crystal couple anniversary premium", "price": 3200},
    {"id": "3", "name": "Diwali Premium Gift Box",   "occasion": "festive",     "tags": "diwali festive dry fruits traditional", "price": 2550},
    {"id": "4", "name": "Custom Photo Frame Set",    "occasion": "birthday",    "tags": "photo frame personalised wooden", "price": 890},
    {"id": "5", "name": "Luxury Candle Collection",  "occasion": "wedding",     "tags": "candle luxury soy fragrance", "price": 1450},
    {"id": "6", "name": "Belgian Chocolate Hamper",  "occasion": "birthday",    "tags": "chocolate belgian hamper sweet", "price": 980},
    {"id": "7", "name": "Memory Scrapbook Kit",      "occasion": "anniversary", "tags": "scrapbook memory personalised DIY", "price": 1100},
    {"id": "8", "name": "Spa & Wellness Kit",        "occasion": "birthday",    "tags": "spa wellness bath relax self-care", "price": 2100},
    {"id": "9", "name": "Silk Saree Gift Box",       "occasion": "festive",     "tags": "saree silk traditional premium", "price": 4500},
    {"id":"10", "name": "Personalised Mug Set",      "occasion": "birthday",    "tags": "mug keychain personalised custom", "price": 599},
]

_corpus = [f"{p['occasion']} {p['tags']}" for p in PRODUCTS]
_tfidf = TfidfVectorizer()
_matrix = _tfidf.fit_transform(_corpus)
_sim = cosine_similarity(_matrix)


class RecommendRequest(BaseModel):
    user_id: Optional[str] = None
    occasion: Optional[str] = None
    budget: Optional[float] = None
    viewed_product_ids: List[str] = []
    n: int = 6


@app.get("/")
def health():
    return {"status": "ok", "service": "Giftura AI", "version": "1.0.0"}


@app.post("/recommend")
def recommend(req: RecommendRequest):
    candidates = list(PRODUCTS)
    if req.occasion:
        candidates = [p for p in candidates if req.occasion.lower() in p["occasion"]]
    if req.budget:
        candidates = [p for p in candidates if p["price"] <= req.budget]

    if req.viewed_product_ids:
        id_index = {p["id"]: i for i, p in enumerate(PRODUCTS)}
        scores = np.zeros(len(PRODUCTS))
        for vid in req.viewed_product_ids:
            idx = id_index.get(vid)
            if idx is not None:
                scores += _sim[idx]
        candidate_ids = {p["id"] for p in candidates}
        candidates = sorted(
            [p for p in PRODUCTS if p["id"] in candidate_ids],
            key=lambda p: scores[next(i for i, x in enumerate(PRODUCTS) if x["id"] == p["id"])],
            reverse=True
        )

    return {"recommendations": candidates[:req.n], "algorithm": "hybrid"}


@app.get("/similar/{product_id}")
def similar(product_id: str, n: int = 4):
    id_index = {p["id"]: i for i, p in enumerate(PRODUCTS)}
    idx = id_index.get(product_id)
    if idx is None:
        raise HTTPException(status_code=404, detail="Product not found")
    scores = list(enumerate(_sim[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    result = [PRODUCTS[i] for i, _ in scores[1:n+1]]
    return {"similar": result}
