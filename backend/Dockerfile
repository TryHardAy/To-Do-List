FROM python:3.12

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./app.py /

#CMD ["python", "app.py"]

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]