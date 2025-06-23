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
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const SalesList = styled.ul`
  margin-top: 0.5rem;
  margin-bottom: 0;
  padding-left: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

interface Venda {
  data: string;
  valor: number;
}

interface Cliente {
  info: {
    nomeCompleto: string;
    detalhes: {
      email: string;
      nascimento: string;
    };
  };
  estatisticas: {
    vendas: Venda[];
  };
}

function formatReal(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ClientsList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
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
        if (!ignore) setClientes(response.data.clientes);
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
            {clientes.length === 0 && <li>Nenhum cliente encontrado.</li>}
            {clientes.map((cliente, idx) => (
              <ListItem key={idx}>
                <strong>Nome:</strong> {cliente.info.nomeCompleto} <br />
                <strong>Email:</strong> {cliente.info.detalhes.email} <br />
                <strong>Nascimento:</strong> {cliente.info.detalhes.nascimento}
                <SalesList>
                  {cliente.estatisticas.vendas.length === 0 ? (
                    <li>Nenhuma venda registrada.</li>
                  ) : (
                    cliente.estatisticas.vendas.map((venda, vIdx) => (
                      <li key={vIdx}>
                        <strong>Data:</strong> {venda.data} | <strong>Valor:</strong> {formatReal(venda.valor)}
                      </li>
                    ))
                  )}
                </SalesList>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
} 