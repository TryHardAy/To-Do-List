from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymysql import connect

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextData(BaseModel):
    action: str
    data: str


@app.post("/api/submit")
async def submit(data: TextData):
    with connect(
        user="root", 
        password="password", 
        host="db", 
        port=3306, 
        database = "tasks_db"
    ) as connection:
        cursor = connection.cursor()
        new_data = manageAction(data, cursor)
        connection.commit()

    print(new_data)
    return {"data": new_data}


def manageAction(data: TextData, cursor):
    match data.action:
        case "SEND":
            actionSEND(data.data, cursor)
            return "SEND"
        case "UPDATE":
            return actionUPDATE(cursor)
        case "DELETE":
            actionDELETE(int(data.data), cursor)
            return "DELETE"
        case "STATUS":
            actionSTATUS(int(data.data), cursor)
            return "STATUS"
        case _:
            print(f"Niepoprawna akcja: {data.action}")
            return 1


def actionSEND(text: str, cursor):
    query = """
    INSERT INTO tasks (text)
    VALUES (%s)
    """

    values = (text)
    cursor.execute(query, values)


def actionUPDATE(cursor):
    query = "SELECT * FROM tasks"
    cursor.execute(query)

    results = cursor.fetchall()
    return toJSONlist(results)


def toJSONlist(data: list[tuple]):
    new = []
    for row in data:
        new.append({
            "id": f"{row[0]}",
            "text": row[1],
            "isCompleted": f"{False if row[2] == 0 else True}"
        })
    return new


def actionDELETE(id: int, cursor):
    query = "DELETE FROM tasks WHERE id = %s"
    values = (id)

    cursor.execute(query, values)


def actionSTATUS(id: int, cursor):
    query = "UPDATE tasks SET completed = NOT completed WHERE id = %s"
    values = (id)

    cursor.execute(query, values)

