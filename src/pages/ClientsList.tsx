import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const List = styled.ul`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  min-width: 350px;
`;

const ListItem = styled.li`
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

export default function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchClients() {
      setLoading(true);
      setError("");
      try {
        const params = name ? { name } : {};
        const response = await api.get("/clients/search", { params });
        if (!ignore) setClients(response.data);
      } catch {
        if (!ignore) setError("Erro ao buscar clientes.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchClients();
    return () => { ignore = true; };
  }, [name]);

  return (
    <Container>
      <div>
        <h1>Lista de Clientes</h1>
        <Input
          type="text"
          placeholder="Filtrar por nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: '#c00' }}>{error}</p>}
        {!loading && !error && (
          <List>
            {clients.length === 0 && <li>Nenhum cliente encontrado.</li>}
            {clients.map((client, idx) => (
              <ListItem key={idx}>
                <strong>Nome:</strong> {client.name} <br />
                <strong>Email:</strong> {client.email} <br />
                <strong>Nascimento:</strong> {client.birth}
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
} 