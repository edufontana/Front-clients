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

const Card = styled.div`
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 350px;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #007bff;
`;

const Info = styled.p`
  font-size: 1.1rem;
  margin: 0.5rem 0;
`;

export default function Ranks() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRanks() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/sales/leaders");
        setData(response.data);
      } catch {
        setError("Erro ao buscar ranks.");
      } finally {
        setLoading(false);
      }
    }
    fetchRanks();
  }, []);

  return (
    <Container>
      <div>
        <h1>Ranks de Vendas</h1>
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: '#c00' }}>{error}</p>}
        {!loading && !error && data && (
          <>
            <Card>
              <Title>Maior Volume de Vendas</Title>
              {data.maiorVolume ? (
                <>
                  <Info><strong>Cliente:</strong> {data.maiorVolume.client_name || data.maiorVolume.client_id}</Info>
                  <Info><strong>Total vendido:</strong> {data.maiorVolume._sum?.value}</Info>
                </>
              ) : <Info>Nenhum dado.</Info>}
            </Card>
            <Card>
              <Title>Maior Média por Venda</Title>
              {data.maiorMedia ? (
                <>
                  <Info><strong>Cliente:</strong> {data.maiorMedia.client_name || data.maiorMedia.client_id}</Info>
                  <Info><strong>Média:</strong> {data.maiorMedia._avg?.value}</Info>
                </>
              ) : <Info>Nenhum dado.</Info>}
            </Card>
            <Card>
              <Title>Mais Dias Únicos com Vendas</Title>
              {data.maiorDiasUnicos ? (
                <>
                  <Info><strong>Cliente:</strong> {data.maiorDiasUnicos.client_id}</Info>
                  <Info><strong>Dias únicos:</strong> {data.maiorDiasUnicos.diasUnicos}</Info>
                </>
              ) : <Info>Nenhum dado.</Info>}
            </Card>
          </>
        )}
      </div>
    </Container>
  );
} 