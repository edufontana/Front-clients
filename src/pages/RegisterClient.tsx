import React, { useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
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
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #218838;
  }
`;

const ErrorMsg = styled.p`
  color: #c00;
  margin: 0;
  text-align: center;
`;

const SuccessMsg = styled.p`
  color: #28a745;
  margin: 0;
  text-align: center;
`;

export default function RegisterClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/clients", { name, email, password, birth });
      setSuccess("Cliente cadastrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setBirth("");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      setError("Erro ao cadastrar cliente. Verifique os dados e tente novamente.");
    }
  }

  function handleBirthChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);
    setBirth(value.slice(0, 10));
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Cadastrar Cliente</h2>
        <Input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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
        <Input
          type="text"
          placeholder="Data de nascimento (dd/mm/aaaa)"
          value={birth}
          onChange={handleBirthChange}
          pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
          title="Formato esperado: dd/mm/aaaa"
          required
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>{success}</SuccessMsg>}
        <Button type="submit">Cadastrar</Button>
      </Form>
    </Container>
  );
} 