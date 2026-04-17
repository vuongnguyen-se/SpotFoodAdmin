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
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getPois } from "../services/poiService";
import {
  createContent,
  deleteContent,
  getContentById,
  getContents,
  updateContent,
} from "../services/contentService";
import { getAudios } from "../services/audioService";

const { Title, Text } = Typography;
const { TextArea } = Input;

function ContentManagementPage() {
  const [contents, setContents] = useState([]);
  const [pois, setPois] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = Form.useForm();

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await getContents();
      setContents(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách contents");
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

  const fetchAudios = async () => {
    try {
      const response = await getAudios();
      setAudios(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách audio");
    }
  };

  useEffect(() => {
    fetchContents();
    fetchPois();
    fetchAudios();
  }, []);

  const poiOptions = useMemo(() => {
    return pois.map((item) => ({
      label: item.name,
      value: item.poiId,
    }));
  }, [pois]);

  const audioOptions = useMemo(() => {
    return audios.map((item) => ({
      label: `Audio #${item.audioId}`,
      value: item.audioId,
    }));
  }, [audios]);

  const handleOpenCreateModal = () => {
    setEditingContentId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (id) => {
    try {
      const response = await getContentById(id);
      const content = response.data;

      if (!content) {
        message.error("Không tìm thấy content");
        return;
      }

      setEditingContentId(id);
      form.setFieldsValue({
        poiId: content.poiId,
        title: content.title,
        description: content.description,
        audioId: content.audioId,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      message.error("Không tải được thông tin content");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContentId(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const payload = {
        title: values.title,
        description: values.description || null,
        audioId: values.audioId ?? null,
      };

      if (editingContentId) {
        await updateContent(editingContentId, payload);
        message.success("Cập nhật content thành công");
      } else {
        await createContent(values.poiId, payload);
        message.success("Tạo content thành công");
      }

      handleCloseModal();
      fetchContents();
    } catch (error) {
      if (error?.errorFields) return;

      console.error(error);
      message.error("Lưu content thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContent(id);
      message.success("Xóa content thành công");
      fetchContents();
    } catch (error) {
      console.error(error);
      message.error("Xóa content thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "contentId",
      key: "contentId",
      width: 90,
    },
    {
      title: "POI ID",
      dataIndex: "poiId",
      key: "poiId",
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Audio ID",
      dataIndex: "audioId",
      key: "audioId",
      width: 120,
      render: (value) => value ?? "N/A",
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
            onClick={() => handleOpenEditModal(record.contentId)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this content?"
            description="Bạn có chắc muốn xóa content này?"
            onConfirm={() => handleDelete(record.contentId)}
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
            Content Management
          </Title>
          <Text type="secondary">
            Quản lý toàn bộ contents trong hệ thống
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
        >
          Add Content
        </Button>
      </Space>

      <Table
        rowKey="contentId"
        columns={columns}
        dataSource={contents}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingContentId ? "Edit Content" : "Add Content"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        okText={editingContentId ? "Update" : "Create"}
        cancelText="Cancel"
        width={720}
      >
        <Form form={form} layout="vertical">
          {!editingContentId && (
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
            label="Title"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập title" }]}
          >
            <Input placeholder="Enter content title" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Audio" name="audioId">
            <Select
              allowClear
              placeholder="Select audio"
              options={audioOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ContentManagementPage;