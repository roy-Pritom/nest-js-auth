import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: 'postgresql://postgres:TSZJgxEERVQIQnVAfnDFZauJxIaXgAwE@autorack.proxy.rlwy.net:34307/railway', // Your Railway PostgreSQL URI
    entities:['dist/**/*.entity{.ts,.js}'], // Add your entity classes here
    migrations:['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: true,
};

export const dataSource = new DataSource(dataSourceOptions);

// Optional: Initialize the dataSource to ensure it's working correctly
dataSource.initialize()
    .then(() => {
        console.log("DataSource has been initialized!");
    })
    .catch((err) => {
        console.error("Error during DataSource initialization:", err);
    });
