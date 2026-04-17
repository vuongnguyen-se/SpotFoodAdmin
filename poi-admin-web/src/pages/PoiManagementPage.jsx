import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  createPoi,
  deletePoi,
  getPoiById,
  getPois,
  updatePoi,
} from "../services/poiService";
import { getCategories } from "../services/categoryService";

const { Title, Text } = Typography;
const { TextArea } = Input;

function PoiManagementPage() {
  const [pois, setPois] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPoiId, setEditingPoiId] = useState(null);

  const [form] = Form.useForm();

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
      message.error("Không tải được danh mục");
    }
  };

  useEffect(() => {
    fetchPois();
    fetchCategories();
  }, []);

  const refreshList = () => {
    fetchPois({
      keyword: keyword || undefined,
      categoryId: selectedCategory || undefined,
    });
  };

  const handleSearch = () => {
    refreshList();
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedCategory(undefined);
    fetchPois();
  };

  const handleOpenCreateModal = () => {
    setEditingPoiId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (id) => {
    try {
        setIsModalOpen(true);
        setEditingPoiId(id);

        const response = await getPoiById(id);
        const poi = response.data;

        if (!poi) {
        message.error("Không tìm thấy POI");
        handleCloseModal();
        return;
        }

        form.setFieldsValue({
        name: poi.name,
        latitude: poi.latitude,
        longitude: poi.longitude,
        imageUrl: poi.imageUrl,
        categoryId: poi.categoryId,
        address: poi.address,
        mapLink: poi.mapLink,
        });
    } catch (error) {
        console.error(error);
        message.error("Không tải được thông tin POI");
        handleCloseModal();
    }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPoiId(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
        imageUrl: values.imageUrl || null,
        categoryId: values.categoryId ?? null,
        address: values.address || null,
        mapLink: values.mapLink || null,
      };

      if (editingPoiId) {
        await updatePoi(editingPoiId, payload);
        message.success("Cập nhật POI thành công");
      } else {
        await createPoi(payload);
        message.success("Tạo POI thành công");
      }

      handleCloseModal();
      refreshList();
    } catch (error) {
      if (error?.errorFields) return;

      console.error(error);
      message.error("Lưu POI thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePoi(id);
      message.success("Xóa POI thành công");
      refreshList();
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
      render: (value) => (value ? new Date(value).toLocaleString() : ""),
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditModal(record.poiId)}
          >
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

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
        >
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

      <Modal
        title={editingPoiId ? "Edit POI" : "Add POI"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        okText={editingPoiId ? "Update" : "Create"}
        cancelText="Cancel"
        width={720}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="POI Name"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên POI" }]}
          >
            <Input placeholder="Enter POI name" />
          </Form.Item>

          <Form.Item label="Category" name="categoryId">
            <Select
              allowClear
              placeholder="Select category"
              options={categoryOptions}
            />
          </Form.Item>

          <Space style={{ display: "flex" }} size={16}>
            <Form.Item label="Latitude" name="latitude" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Latitude"
                controls={false}
              />
            </Form.Item>

            <Form.Item label="Longitude" name="longitude" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Longitude"
                controls={false}
              />
            </Form.Item>
          </Space>

          <Form.Item label="Image URL" name="imageUrl">
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item label="Map Link" name="mapLink">
            <Input placeholder="Enter Google Maps link" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <TextArea rows={3} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PoiManagementPage;