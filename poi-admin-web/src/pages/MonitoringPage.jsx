import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { getStatsOverview, getHeatmapData } from "../services/statsService";
import HeatmapMap from "../components/HeatmapMap";

const { Title, Text } = Typography;

export default function MonitoringPage() {
  const [stats, setStats] = useState({
    onlineNow: 0,
    activeToday: 0,
    activeThisWeek: 0,
  });
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadStats();

    const interval = setInterval(() => {
      loadStats(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadStats = async (showLoading = true) => {
    try {
        if (showLoading) setLoading(true);

        const [statsResponse, heatmapResponse] = await Promise.all([
        getStatsOverview(),
        getHeatmapData(),
        ]);

        setStats(statsResponse.data);
        setHeatmapPoints(heatmapResponse.data);
        setLastUpdated(new Date());
    } catch (error) {
        console.error("Failed to load monitoring stats:", error);
    } finally {
        if (showLoading) setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              App Monitoring
            </Title>
            <Text type="secondary">
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "--"}
            </Text>
          </div>

          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadStats()}>
              Refresh
            </Button>
          </Space>
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Card title="Online Now" bordered={false}>
              <Title level={2} style={{ margin: 0 }}>
                {stats.onlineNow}
              </Title>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Active Today" bordered={false}>
              <Title level={2} style={{ margin: 0 }}>
                {stats.activeToday}
              </Title>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Active This Week" bordered={false}>
              <Title level={2} style={{ margin: 0 }}>
                {stats.activeThisWeek}
              </Title>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
            <Card title="POI View Heatmap (Last 7 Days)" bordered={false}>
                <HeatmapMap points={heatmapPoints} />
            </Card>
        </div>
      </div>
    </Spin>
  );
}