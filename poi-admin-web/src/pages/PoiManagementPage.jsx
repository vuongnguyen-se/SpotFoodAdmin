import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Typography,
  Tag,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getPois, deletePoi } from "../services/poiService";
import { getCategories } from "../services/categoryService";

const { Title, Text } = Typography;

function PoiManagementPage() {
  const [pois, setPois] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const fetchPois = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getPois(params);
      setPois(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách POIs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPois();
    fetchCategories();
  }, []);

  const handleSearch = () => {
    fetchPois({
      keyword: keyword || undefined,
      categoryId: selectedCategory || undefined,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedCategory(undefined);
    fetchPois();
  };

  const handleDelete = async (id) => {
    try {
      await deletePoi(id);
      message.success("Xóa POI thành công");
      fetchPois({
        keyword: keyword || undefined,
        categoryId: selectedCategory || undefined,
      });
    } catch (error) {
      console.error(error);
      message.error("Xóa POI thất bại");
    }
  };

  const categoryOptions = useMemo(() => {
    return categories.map((item) => ({
      label: item.categoryName,
      value: item.categoryId,
    }));
  }, [categories]);

  const columns = [
    {
      title: "ID",
      dataIndex: "poiId",
      key: "poiId",
      width: 80,
    },
    {
      title: "POI Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (_, record) =>
        record.categoryName ? (
          <Tag color="blue">{record.categoryName}</Tag>
        ) : (
          <Text type="secondary">N/A</Text>
        ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
      width: 140,
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
      width: 140,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString();
      },
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">
            Edit
          </Button>

          <Popconfirm
            title="Delete this POI?"
            description="Bạn có chắc muốn xóa POI này?"
            onConfirm={() => handleDelete(record.poiId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        align="start"
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            POI Management
          </Title>
          <Text type="secondary">
            Quản lý danh sách địa điểm trong hệ thống
          </Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large">
          Add POI
        </Button>
      </Space>

      <Space
        wrap
        size="middle"
        style={{
          marginBottom: 20,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space wrap>
          <Input
            allowClear
            placeholder="Search POI..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 260 }}
          />

          <Select
            allowClear
            placeholder="Filter category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            style={{ width: 220 }}
          />

          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>

          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </Space>

      <Table
        rowKey="poiId"
        columns={columns}
        dataSource={pois}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

export default PoiManagementPage;