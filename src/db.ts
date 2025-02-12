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

        await sql`
        CREATE TABLE IF NOT EXISTS categories (
            categories_id SERIAL PRIMARY KEY,
            name TEXT,
            image TEXT
        )`

        await sql`
        CREATE TABLE IF NOT EXISTS recipes (
            recipes_id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            time TEXT NOT NULL,
            image TEXT NOT NULL,
            portions TEXT NOT NULL,
            score INT NOT NULL DEFAULT 0,
            FOREIGN KEY (category) REFERENCES categories(categories_id),
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP
        )`

        await sql`
        CREATE TABLE IF NOT EXISTS ingredients (
            ingredients_id SERIAL PRIMARY KEY,
            item TEXT NOT NULL,
            value TEXT NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipes_id) DELETE CASCADE
        )`

        await sql`
        CREATE TABLE IF NOT EXISTS steps (
            steps_id SERIAL PRIMARY KEY,
            step TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipes_id) DELETE CASCADE
        )`

        console.log('database created')

    } catch (error) {
        console.log(error)   
    }
}

createDataBase()

export default sql