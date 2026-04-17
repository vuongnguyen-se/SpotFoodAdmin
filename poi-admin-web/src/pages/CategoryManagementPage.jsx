import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

const { Title, Text } = Typography;

function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategoryId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingCategoryId(record.categoryId);
    form.setFieldsValue({
      categoryName: record.categoryName,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const payload = {
        categoryName: values.categoryName,
      };

      if (editingCategoryId) {
        await updateCategory(editingCategoryId, payload);
        message.success("Cập nhật category thành công");
      } else {
        await createCategory(payload);
        message.success("Tạo category thành công");
      }

      handleCloseModal();
      fetchCategories();
    } catch (error) {
      if (error?.errorFields) return;

      console.error(error);
      message.error("Lưu category thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 100,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (value) => (value ? new Date(value).toLocaleString() : ""),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditModal(record)}
          >
            Edit
          </Button>
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
            Category Management
          </Title>
          <Text type="secondary">Quản lý danh mục POI trong hệ thống</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
        >
          Add Category
        </Button>
      </Space>

      <Table
        rowKey="categoryId"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingCategoryId ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        okText={editingCategoryId ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Vui lòng nhập tên category" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryManagementPage;