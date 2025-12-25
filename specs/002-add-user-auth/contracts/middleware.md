# Python Middleware Contract

## Interface: `get_current_user`

The Python backend must implement a dependency that retrieves the current user based on the session token.

### Input
- **Source**: HTTP Header `Authorization: Bearer <token>` OR Cookie `better-auth.session_token`.
- **Validation**:
  - Token must exist.
  - Token must be present in `session` table in SQLite DB.
  - `session.expiresAt` must be in the future.

### Output
- **Success**: Returns a `User` object (Pydantic model) containing:
  - `id`: str
  - `email`: str
  - `name`: str
- **Failure**: Raises `HTTPException(401, detail="Unauthorized")`.

### SQL Query (Reference)
```sql
SELECT u.id, u.email, u.name 
FROM session s
JOIN user u ON s.userId = u.id
WHERE s.token = :token AND s.expiresAt > :now
```
