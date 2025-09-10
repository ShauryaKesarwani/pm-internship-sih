from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from pathlib import Path

from backend_py.resumeParser import ResumeParser  # your class

router = APIRouter(tags=["resume"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create one global parser instance (loads API key once)
resume_parser = ResumeParser()


@router.post("/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    try:
        # Save the file temporarily
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse with your existing parser
        parsed_data = resume_parser.review_resume(str(file_path))

        # Cleanup after parsing
        os.remove(file_path)

        # Return parsed JSON
        return JSONResponse(content=parsed_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

