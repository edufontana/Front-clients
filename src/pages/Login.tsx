import React, { useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0056b3;
  }
`;

const ErrorMsg = styled.p`
  color: #c00;
  margin: 0;
  text-align: center;
`;

const RegisterButton = styled.button`
  margin-top: 1rem;
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #0056b3;
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    try {
      const response = await api.post("/session", { email, password });
      const token = response.data.token;
      console.log('tokeennn', response.data.tokenJwt)
      localStorage.setItem("token", response.data.tokenJwt);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/home");
    } catch {
      setError("Email ou senha inválidos.");
    }
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <Container>
      <div>
        <Form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="submit">Entrar</Button>
        </Form>
        <RegisterButton onClick={handleRegister} type="button">
          Registrar
        </RegisterButton>
      </div>
    </Container>
  );
} 