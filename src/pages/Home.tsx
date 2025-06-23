import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const TopBar = styled.div`
  width: 100vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.5rem 2rem 0 2rem;
  box-sizing: border-box;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.7rem 2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(220,53,69,0.08);
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: #a71d2a;
    box-shadow: 0 4px 16px rgba(220,53,69,0.15);
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 350px;
  margin: 3rem auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
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

export default function Home() {
  const [sales, setSales] = useState<{ date: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    async function fetchSales() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/sales/stats");
        setSales(response.data);
      } catch {
        setError("Erro ao buscar vendas.");
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [navigate]);

  function handleGoToClients() {
    navigate("/clients");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/", { replace: true });
  }

  return (
    <Container>
      <TopBar>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </TopBar>
      <h1 style={{ marginTop: 0, marginBottom: 24 }}>Vendas por dia</h1>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: '#c00' }}>{error}</p>}
      {!loading && !error && (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sales} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
      <div style={{ display: 'flex', gap: '1rem', marginTop: 24 }}>
        <Button onClick={handleGoToClients}>Ver clientes</Button>
        <Button onClick={() => navigate("/ranks")}>Ranks</Button>
      </div>
    </Container>
  );
} 