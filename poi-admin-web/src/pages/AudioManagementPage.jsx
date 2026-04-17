import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  Upload,
  message,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { deleteAudio, getAudios, uploadAudio } from "../services/audioService";

const { Title, Text } = Typography;

function AudioManagementPage() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAudios = async () => {
    try {
      setLoading(true);
      const response = await getAudios();
      setAudios(response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không tải được danh sách audio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudios();
  }, []);

  const handleOpenUploadModal = () => {
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleUploadSubmit = async () => {
    try {
      if (!selectedFile) {
        message.warning("Vui lòng chọn file audio");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      await uploadAudio(formData);

      message.success("Upload audio thành công");
      handleCloseModal();
      fetchAudios();
    } catch (error) {
      console.error(error);
      message.error("Upload audio thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAudio(id);
      message.success("Xóa audio thành công");
      fetchAudios();
    } catch (error) {
      console.error(error);
      message.error("Xóa audio thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "audioId",
      key: "audioId",
      width: 90,
    },
    {
      title: "File Path",
      dataIndex: "filePath",
      key: "filePath",
      render: (value) =>
        value ? (
          <a
            href={`http://localhost:5284${value}`}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      render: (value) => value ?? "N/A",
    },
    {
      title: "File Size",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 140,
      render: (value) =>
        value ? `${(value / 1024).toFixed(2)} KB` : "N/A",
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
      width: 140,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete this audio?"
            description="Bạn có chắc muốn xóa audio này?"
            onConfirm={() => handleDelete(record.audioId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
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
            Audio Management
          </Title>
          <Text type="secondary">
            Quản lý file audio trong hệ thống
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenUploadModal}
        >
          Upload Audio
        </Button>
      </Space>

      <Table
        rowKey="audioId"
        columns={columns}
        dataSource={audios}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Upload Audio"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleUploadSubmit}
        confirmLoading={isSubmitting}
        okText="Upload"
        cancelText="Cancel"
      >
        <Upload
          beforeUpload={(file) => {
            setSelectedFile(file);
            return false;
          }}
          maxCount={1}
          onRemove={() => setSelectedFile(null)}
        >
          <Button icon={<UploadOutlined />}>Choose Audio File</Button>
        </Upload>

        {selectedFile && (
          <div style={{ marginTop: 12 }}>
            <Text>Selected file: {selectedFile.name}</Text>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AudioManagementPage;