Sure! Here's the complete `README.md` content in markdown format — ready for copy-paste:

```markdown
# 📊 statsFetch

A developer-focused API server that aggregates coding platform stats from **LeetCode**, **GitHub**, **Codeforces**, and **CodeChef** in one place. Get user performance, contributions, and contest history through clean RESTful POST endpoints.

---

## 🌐 Supported Platforms

- ✅ LeetCode (profile + contests)
- ✅ GitHub (public repo stats + contribution graph)
- ✅ Codeforces (profile + contests)
- ✅ CodeChef (basic profile stats + heatmap)

---

## 🚀 Live Demo (if hosted)

https://statsfetch.vercel.app/

---

## 🔧 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/BtraRahul/StatsFetch
   cd statsFetch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for GitHub)**

   Create a `.env` file:

   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

   *Alternatively, you can pass your GitHub token in the request header.*

4. **Run the server**

   ```bash
   npm start
   ```

   The server will start at: `http://localhost:3000`

---

## 📡 API Endpoints

All endpoints use `POST` with JSON bodies.

### 🔹 LeetCode Stats

#### `/api/leetcode-stats`

```json
{
  "username": "your_leetcode_username"
}
```

Returns profile data such as:
- Total questions solved
- Ranking
- Submission stats

---

### 🔹 LeetCode Contest History

#### `/api/leetcode-stats/user-contests`

```json
{
  "username": "your_leetcode_username"
}
```

Returns:
- Contest name
- Rank
- Rating change
- Date

---

### 🔹 GitHub Stats

#### `/api/github-stats`

```json
{
  "username": "your_github_username"
}
```

**Authentication Options:**

- Option 1: Use `.env` file (`GITHUB_TOKEN=...`)
- Option 2: Pass token in headers:

```
Authorization: Bearer YOUR_GITHUB_TOKEN
```

Returns:
- Total public repositories
- Total stars and forks
- Contribution graph data

---

### 🔹 Codeforces Stats

#### `/api/codeforces-stats`

```json
{
  "username": "your_codeforces_handle"
}
```

Returns:
- Rating
- Max rating
- Rank
- Number of contests

---

### 🔹 Codeforces Contest History

#### `/api/codeforces-stats/user-contests`

```json
{
  "username": "your_codeforces_handle"
}
```

Returns:
- Contest name
- Rank
- Old rating
- New rating
- Rating change

---

### 🔹 CodeChef Stats

#### `/api/codechef-stats`

```json
{
  "username": "your_codechef_username"
}
```

Returns:
- Current rating
- Highest rating
- Global and country rank

---

## 🔄 Sample cURL Requests

**GitHub Stats with Token in Header:**

```bash
curl -X POST http://localhost:3000/api/github-stats \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
     -d '{"username": "your_github_username"}'
```

**LeetCode Contests:**

```bash
curl -X POST http://localhost:3000/api/leetcode-stats/user-contests \
     -H "Content-Type: application/json" \
     -d '{"username": "your_leetcode_username"}'
```

**Codeforces Contests:**

```bash
curl -X POST http://localhost:3000/api/codeforces-stats/user-contests \
     -H "Content-Type: application/json" \
     -d '{"username": "your_codeforces_handle"}'
```

---

## 📘 Token Guide for GitHub

To access GitHub stats, you need a **Personal Access Token**:

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token**
3. Select:
   - `public_repo`
   - `read:user`
4. Copy the token and either:
   - Put it in your `.env` as `GITHUB_TOKEN`
   - Send it via header: `Authorization: Bearer <your_token>`

---

## 🧾 License

MIT © [Your Name]

---

## 🤝 Contributing

Pull requests and feedback are welcome! Feel free to fork, open issues, or suggest enhancements.
```
