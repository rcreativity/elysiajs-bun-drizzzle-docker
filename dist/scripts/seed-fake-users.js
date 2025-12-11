import { faker } from "@faker-js/faker";
import { db, schema } from "../db"; // your Drizzle setup
async function seedFakeUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            name: faker.person.fullName(), // fake full name
            age: faker.number.int({ min: 18, max: 70 }), // fake age
        });
    }
    await db.insert(schema.users).values(users);
    console.log(`✅ Inserted ${count} fake users`);
}
// Example: insert 50 fake users
seedFakeUsers(10000).catch(console.error);
