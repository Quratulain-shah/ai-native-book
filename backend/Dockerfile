FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

# Create a writable directory for the database if it uses SQLite
# and ensuring permissions for the user (standard HF user is 1000)
RUN mkdir -p /code/data && chmod 777 /code/data

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
