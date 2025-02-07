import postgres from "postgres";

const sql = postgres({
    host: 'localhost',
    database: 'green-book',
    port: 5432,
    user: 'postgres',
    password: 'admin',
});


const createDataBase = async () => {
    try {

        await sql`
        CREATE TABLE IF NOT EXISTS users (
            users_id SERIAL PRIMARY KEY,
            login TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'client',
            ban BOOLEAN DEFAULT false,
            active BOOLEAN DEFAULT false
        )`

        console.log('database created')

    } catch (error) {
        console.log(error)   
    }
}

createDataBase()

export default sql