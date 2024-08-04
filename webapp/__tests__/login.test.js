import { credentialsLoginAction } from '@/app/actions/auth/login.js'

test('User registration adds a new user to the database', async () => {
    const newUser = { username: 'newuser', password: 'password123' };
    const formData = new FormData();
    formData.append('username', newUser.username);
    formData.append('password', newUser.password);


    const res = await credentialsLoginAction({}, formData);

    // Check if the new user exists in the database
    const user = await getUserByUsername('newuser');
    expect(user).toBeDefined();
});
