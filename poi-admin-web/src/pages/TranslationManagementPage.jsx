import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getPois } from "../services/poiService";
import {
  createTranslation,
  deleteTranslation,
  getTranslationById,
  getTranslations,
  updateTranslation,
} from "../services/translationService";

const { Title, Text } = Typography;
const { TextArea } = Input;

function TranslationManagementPage() {
  const [translations, setTranslations] = useState([]);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTranslationId, setEditingTranslationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = Form.useForm();

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const response = await getTranslations();
      setTranslations(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách translations");
    } finally {
      setLoading(false);
    }
  };

  const fetchPois = async () => {
    try {
      const response = await getPois();
      setPois(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách POIs");
    }
  };

  useEffect(() => {
    fetchTranslations();
    fetchPois();
  }, []);

  const poiOptions = useMemo(() => {
    return pois.map((item) => ({
      label: item.name,
      value: item.poiId,
    }));
  }, [pois]);

  const handleOpenCreateModal = () => {
    setEditingTranslationId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (id) => {
    try {
      const response = await getTranslationById(id);
      const translation = response.data;

      if (!translation) {
        message.error("Không tìm thấy translation");
        return;
      }

      setEditingTranslationId(id);
      form.setFieldsValue({
        poiId: translation.poiId,
        languageCode: translation.languageCode,
        name: translation.name,
        description: translation.description,
        address: translation.address,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      message.error("Không tải được thông tin translation");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTranslationId(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const payload = {
        languageCode: values.languageCode,
        name: values.name,
        description: values.description || null,
        address: values.address || null,
      };

      if (editingTranslationId) {
        await updateTranslation(editingTranslationId, payload);
        message.success("Cập nhật translation thành công");
      } else {
        await createTranslation(values.poiId, payload);
        message.success("Tạo translation thành công");
      }

      handleCloseModal();
      fetchTranslations();
    } catch (error) {
      if (error?.errorFields) return;

      console.error(error);
      message.error("Lưu translation thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTranslation(id);
      message.success("Xóa translation thành công");
      fetchTranslations();
    } catch (error) {
      console.error(error);
      message.error("Xóa translation thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "translationId",
      key: "translationId",
      width: 90,
    },
    {
      title: "POI ID",
      dataIndex: "poiId",
      key: "poiId",
      width: 100,
    },
    {
      title: "Language",
      dataIndex: "languageCode",
      key: "languageCode",
      width: 120,
      render: (value) => <Tag color="blue">{value || "N/A"}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : ""),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
            onClick={() => handleOpenEditModal(record.translationId)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this translation?"
            description="Bạn có chắc muốn xóa translation này?"
            onConfirm={() => handleDelete(record.translationId)}
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
            Translation Management
          </Title>
          <Text type="secondary">
            Quản lý toàn bộ translations trong hệ thống
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
        >
          Add Translation
        </Button>
      </Space>

      <Table
        rowKey="translationId"
        columns={columns}
        dataSource={translations}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingTranslationId ? "Edit Translation" : "Add Translation"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        okText={editingTranslationId ? "Update" : "Create"}
        cancelText="Cancel"
        width={720}
      >
        <Form form={form} layout="vertical">
          {!editingTranslationId && (
            <Form.Item
              label="POI"
              name="poiId"
              rules={[{ required: true, message: "Vui lòng chọn POI" }]}
            >
              <Select
                placeholder="Select POI"
                options={poiOptions}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          )}

          <Form.Item
            label="Language Code"
            name="languageCode"
            rules={[{ required: true, message: "Vui lòng nhập language code" }]}
          >
            <Input placeholder="Ex: vi, en, fr" />
          </Form.Item>

          <Form.Item
            label="Translated Name"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên bản dịch" }]}
          >
            <Input placeholder="Enter translated name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <TextArea rows={3} placeholder="Enter translated address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TranslationManagementPage;