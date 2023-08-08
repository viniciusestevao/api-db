const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configurações de acesso ao banco de dados
const dbConfig = {
  user: "hexagon",
  password: "H3x4g0n0",
  server: "hexagon.database.windows.net",
  database: "ProjetoReact",
  options: {
    encrypt: true, // Use esta opção se estiver usando SSL
  },
};

app.use(cors());
app.use(bodyParser.json());

// ================================== LOGIN ==================================

// Rota para autenticação de login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();
    const query = `SELECT * FROM users WHERE username = @username AND password = @password`;
    request.input("username", username);
    request.input("password", password);
    const result = await request.query(query);
    pool.close();

    //alert(result);

    if (result.recordset.length > 0) {
      res.json({ success: true, message: "Autenticação bem-sucedida." });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas." });
    }
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== USERS ==================================

app.get("/users", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = "SELECT * FROM users";
    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.post("/createUser", async (req, res) => {
  try {
    const { username, password, email } = req.body; // Dados do novo usuário

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    // Query para inserir o novo usuário
    const query = `INSERT INTO users (username, password, email) VALUES (@username, @password, @email)`;
    request.input("username", username);
    request.input("password", password);
    request.input("email", email);

    await request.query(query);
    pool.close();

    res
      .status(201)
      .json({ success: true, message: "Usuário criado com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.put("/updateUser/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { username, password, email } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `
          UPDATE users
          SET username = @username, password = @password, email = @email
          WHERE user_id = @userId;
        `;

    request.input("userId", sql.Int, userId);
    request.input("username", sql.NVarChar, username);
    request.input("password", sql.NVarChar, password);
    request.input("email", sql.NVarChar, email);

    await request.query(query);
    pool.close();

    res
      .status(200)
      .json({ success: true, message: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
    //console.error('Ocorreu um erro no servidor.', error.message);
  }
});

app.delete("/deleteUser/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id; // Obtém o ID do usuário a ser excluído

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `
        DELETE FROM users
        WHERE user_id = @userId;
      `;

    request.input("userId", sql.Int, userId);
    await request.query(query);
    console.log("Usuário excluído com sucesso.");

    pool.close();

    res.json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Ocorreu um erro no servidor.", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== PEOPLE ==================================

app.get("/people/:is_candidate", async (req, res) => {
  try {
    const isCandidate = req.params.is_candidate; // Obtém o tipo da pessoa para fazer as listagens separadamente

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM people WHERE is_candidate = ${isCandidate}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.post("/createPeople", async (req, res) => {
  try {
    const {
      user_id,
      name,
      doc_rg,
      doc_cpf,
      birth_date,
      phone_1,
      phone_2,
      address_description,
      address_number,
      neighborhood,
      city,
      state,
      CEP,
      is_candidate,
    } = req.body; // Dados da nova pessoa (candidato ou recrutador)

    console.log(JSON.stringify(req.body));
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    // Query para inserir o novo usuário
    const query =
      `INSERT INTO people (user_id, name, doc_rg, doc_cpf, birth_date, phone_1, phone_2, address_description, address_number, neighborhood, city, state, CEP, is_candidate) VALUES ` +
      `(@user_id, @name, @doc_rg, @doc_cpf, @birth_date, @phone_1, @phone_2, @address_description, @address_number, @neighborhood, @city, @state, @CEP, @is_candidate)  `;

    request.input("user_id", user_id);
    request.input("name", name);
    request.input("doc_rg", doc_rg);
    request.input("doc_cpf", doc_cpf);
    request.input("birth_date", birth_date);
    request.input("phone_1", phone_1);
    request.input("phone_2", phone_2);
    request.input("address_description", address_description);
    request.input("address_number", address_number);
    request.input("neighborhood", neighborhood);
    request.input("city", city);
    request.input("state", state);
    request.input("CEP", CEP);
    request.input("is_candidate", is_candidate);

    await request.query(query);
    pool.close();

    const successMessage = is_candidate
      ? "Candidato criado com sucesso."
      : "Recrutador criado com sucesso.";

    res.status(201).json({ success: true, message: successMessage });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.put("/updatePeople/:person_id", async (req, res) => {
  try {
    const personId = req.params.person_id;
    const {
      user_id,
      name,
      doc_rg,
      doc_cpf,
      birth_date,
      phone_1,
      phone_2,
      address_description,
      address_number,
      neighborhood,
      city,
      state,
      CEP,
      is_candidate,
    } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();
    const query = `
          UPDATE people
          SET user_id = @user_id, name = @name, doc_rg = @doc_rg, doc_cpf = @doc_cpf, birth_date = @birth_date, phone_1 = @phone_1, phone_2 = @phone_2, address_description = @address_description, address_number = @address_number, neighborhood = @neighborhood, city = @city, state = @state, CEP = @CEP, is_candidate = @is_candidate
          WHERE person_id = ${personId};
        `;

    request.input("user_id", user_id);
    request.input("name", name);
    request.input("doc_rg", doc_rg);
    request.input("doc_cpf", doc_cpf);
    request.input("birth_date", birth_date);
    request.input("phone_1", phone_1);
    request.input("phone_2", phone_2);
    request.input("address_description", address_description);
    request.input("address_number", address_number);
    request.input("neighborhood", neighborhood);
    request.input("city", city);
    request.input("state", state);
    request.input("CEP", CEP);
    request.input("is_candidate", is_candidate);

    await request.query(query);
    pool.close();

    const successMessage = is_candidate
      ? "Candidato atualizado com sucesso."
      : "Recrutador atualizado com sucesso.";

    res.status(200).json({ success: true, message: successMessage });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
    //console.error('Ocorreu um erro no servidor.', error.message);
  }
});

app.delete("/deletePeople/:person_id", async (req, res) => {
  try {
    const personId = req.params.person_id;
    const { is_candidate } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `
        DELETE FROM people
        WHERE person_id = @personId;
      `;

    request.input("personId", sql.Int, personId);
    await request.query(query);

    const proccessMessage = is_candidate
      ? "Candidato excluído com sucesso."
      : "Recrutador excluído com sucesso.";

    console.log(proccessMessage);

    pool.close();

    res.json({ success: true, message: proccessMessage });
  } catch (error) {
    console.error("Ocorreu um erro no servidor.", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== APLLIES ==================================

app.get("/applies", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT a.*, isnull(c.name,'') as candidateName, isnull(r.name,'') as recruiterName
                     FROM applies a
                  LEFT JOIN people c ON a.candidate_id = c.person_id
                  LEFT JOIN people r ON a.recruiter_id = r.person_id 
    `;
    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/candidate_applies/:candidate_id", async (req, res) => {
  try {
    const candidateId = req.params.candidate_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM applies WHERE candidate_id = ${candidateId}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.post("/createApply", async (req, res) => {
  try {
    const { candidate_id, recruiter_id, start_date, finish_date, comment } =
      req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query =
      `INSERT INTO applies (candidate_id, recruiter_id, create_date, start_date, finish_date, comment) VALUES ` +
      `(@candidate_id, @recruiter_id, getDate(), @start_date, @finish_date, @comment)  `;

    request.input("candidate_id", candidate_id);
    request.input("recruiter_id", recruiter_id);
    request.input("start_date", start_date);
    request.input("finish_date", finish_date);
    request.input("comment", comment);

    const result = await request.query(query);
    pool.close();

    if (result.rowsAffected[0]>0) {
      const pool2 = new sql.ConnectionPool(dbConfig);
      await pool2.connect();
      const request2 = pool2.request();
      const query2 = `SELECT top 1 isnull(apply_id,0) as apply_id FROM applies (NOLOCK) ORDER BY apply_id desc `;
      const result2 = await request2.query(query2);

      pool.close();

      console.log(result2.recordset[0].apply_id);
      res.status(201).json({
        success: true,
        message: "Aplicação criada com sucesso.",
        apply_id: result2.recordset[0].apply_id,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Não foi possível incluir a aplicação.",
        apply_id: 0,
      });
    }
  } catch (error) {
    console.error("Erro:", error.message);
    res.status(500).json({
      success: false,
      message: "Ocorreu um erro no servidor.",
      apply_id: 0,
    });
  }
});

app.put("/updateApply/:apply_id", async (req, res) => {
  try {
    const applyId = req.params.apply_id;
    const { start_date, finish_date, comment } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();
    const query = `
          UPDATE applies
          SET start_date = @start_date, finish_date = @finish_date, comment = @comment
          WHERE apply_id = ${applyId};
        `;

    request.input("start_date", start_date);
    request.input("finish_date", finish_date);
    request.input("comment", comment);

    await request.query(query);
    pool.close();

    res
      .status(200)
      .json({ success: true, message: "Aplicação atualizada com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.delete("/deleteApply/:apply_id", async (req, res) => {
  try {
    const applyId = req.params.apply_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = ` DELETE FROM applies WHERE apply_id = @applyId; `;

    request.input("applyId", sql.Int, applyId);
    await request.query(query);

    pool.close();

    res.json({ success: true, message: "Aplicação excluída com sucesso." });
  } catch (error) {
    console.error("Ocorreu um erro no servidor.", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== TESTS ==================================

app.get("/tests", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = "SELECT * FROM tests";
    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/tests_can_copy", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query =
      "SELECT test_id, apply_id, title, description, can_copy FROM tests WHERE can_copy=1";
    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/test/:test_id", async (req, res) => {
  try {
    const testId = req.params.test_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM tests WHERE test_id = ${testId}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/apply_tests/:apply_id", async (req, res) => {
  try {
    const applyId = req.params.apply_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM tests WHERE apply_id = ${applyId}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.post("/createTest", async (req, res) => {
  try {
    const { apply_id, title, description, instruction, can_copy } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query =
      `INSERT INTO tests (apply_id, title, description, instruction, can_copy) VALUES ` +
      `(@apply_id, @title, @description, @instruction, @can_copy)  `;

    request.input("apply_id", apply_id);
    request.input("title", title);
    request.input("description", description);
    request.input("instruction", instruction);
    request.input("can_copy", can_copy);

    await request.query(query);
    pool.close();

    res
      .status(201)
      .json({ success: true, message: "Teste criado com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.put("/updateTest/:test_id", async (req, res) => {
  try {
    const testId = req.params.test_id;
    const { apply_id, title, description, instruction, can_copy } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();
    const query = `
          UPDATE tests
          SET apply_id = @apply_id, title = @title, description = @description, instruction = @instruction, can_copy = @can_copy
          WHERE question_id = ${testId};
        `;

    request.input("apply_id", apply_id);
    request.input("title", title);
    request.input("description", description);
    request.input("instruction", instruction);
    request.input("can_copy", can_copy);

    await request.query(query);
    pool.close();

    res
      .status(200)
      .json({ success: true, message: "Teste atualizado com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.delete("/deleteTest/:test_id", async (req, res) => {
  try {
    const testId = req.params.test_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = ` DELETE FROM tests WHERE test_id = @testId; `;

    request.input("testId", sql.Int, testId);
    await request.query(query);

    pool.close();

    res.json({ success: true, message: "Teste excluído com sucesso." });
  } catch (error) {
    console.error("Ocorreu um erro no servidor.", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== QUESTIONS ==================================

app.get("/questions", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = "SELECT * FROM questions";
    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/question/:question_id", async (req, res) => {
  try {
    const questionId = req.params.question_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM questions WHERE question_id = ${questionId}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.get("/test_questions/:test_id", async (req, res) => {
  try {
    const testId = req.params.test_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = `SELECT * FROM questions WHERE test_id = ${testId}`;

    const result = await request.query(query);
    pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.post("/createQuestion", async (req, res) => {
  try {
    const {
      test_id,
      tag,
      description,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      can_copy,
    } = req.body;

    console.log(JSON.stringify(req.body));
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query =
      `INSERT INTO questions (test_id, tag, description, option_a, option_b, option_c, option_d, option_e, can_copy) VALUES ` +
      `(@test_id, @tag, @description, @option_a, @option_b, @option_c, @option_d, @option_e, @can_copy)  `;

    request.input("test_id", test_id);
    request.input("tag", tag);
    request.input("description", description);
    request.input("option_a", option_a);
    request.input("option_b", option_b);
    request.input("option_c", option_c);
    request.input("option_d", option_d);
    request.input("option_e", option_e);
    request.input("can_copy", can_copy);

    await request.query(query);
    pool.close();

    res
      .status(201)
      .json({ success: true, message: "Questão criada com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.put("/updateQuestion/:question_id", async (req, res) => {
  try {
    const questionId = req.params.question_id;
    const {
      test_id,
      tag,
      description,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      can_copy,
    } = req.body;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();
    const query = `
          UPDATE questions
          SET test_id = @test_id, tag = @tag, description = @description, option_a = @option_a, option_b = @option_b, option_c = @option_c, option_d = @option_d, option_e = @option_e, can_copy = @can_copy
          WHERE question_id = ${questionId};
        `;

    request.input("test_id", test_id);
    request.input("tag", tag);
    request.input("description", description);
    request.input("option_a", option_a);
    request.input("option_b", option_b);
    request.input("option_c", option_c);
    request.input("option_d", option_d);
    request.input("option_e", option_e);
    request.input("can_copy", can_copy);

    await request.query(query);
    pool.close();

    res
      .status(200)
      .json({ success: true, message: "Questão atualizada com sucesso." });
  } catch (error) {
    console.error("Erro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

app.delete("/deleteQuestion/:question_id", async (req, res) => {
  try {
    const questionId = req.params.question_id;

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const request = pool.request();

    const query = ` DELETE FROM questions WHERE question_id = @applyId; `;

    request.input("questionId", sql.Int, questionId);
    await request.query(query);

    console.log(proccessMessage);

    pool.close();

    res.json({ success: true, message: "Aplicação excluída com sucesso." });
  } catch (error) {
    console.error("Ocorreu um erro no servidor.", error.message);
    res
      .status(500)
      .json({ success: false, message: "Ocorreu um erro no servidor." });
  }
});

// ================================== OTHERS ==================================

app.get("/", (req, res) => {
  res.send("API Intermediária para Projeto React"); // Uma mensagem de boas-vindas
});

app.listen(port, () => {
  console.log(`Servidor executando na porta ${port}`);
});
