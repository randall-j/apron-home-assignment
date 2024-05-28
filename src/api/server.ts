import { createServer, Model, Response } from 'miragejs';

const server = () => {
  createServer({
    models: {
      users: Model,
    },

    routes() {
      this.get('/api/users', (schema) => {
        return schema.all('users');
      });

      this.get('/api/users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.find('users', id);

        if (!user) {
          return new Response(404, {}, { message: 'User not found' });
        }

        return user;
      });

      this.post('/api/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        schema.create('users', attrs);

        return new Response(201, {});
      });

      this.patch('/api/users/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const user = schema.find('users', id);

        if (!user) {
          return new Response(404, {}, { message: 'User not found' });
        }

        user.update(attrs);

        return new Response(204, {});
      });

      this.delete('/api/users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.find('users', id);

        if (!user) {
          return new Response(404, {}, { message: 'User not found' });
        }

        user.destroy();

        return new Response(204, {});
      });
    },
  });
};

export default server;
