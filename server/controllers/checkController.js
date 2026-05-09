const axios = require('axios');
const NewsCheck = require('../models/NewsCheck');

exports.predictAndSave = async (req, res) => {
  const { text } = req.body;
  try {
    // 1. Gửi request sang AI Flask API
    const aiResponse = await axios.post(process.env.FLASK_API_URL, { text }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("AI Response:", aiResponse.data);

    // Xử lý cả 2 format: trả trực tiếp { label, confidence } hoặc bọc trong { data: { label, confidence } }
    const responseData = aiResponse.data.data ? aiResponse.data.data : aiResponse.data;
    const label = responseData.label || responseData.predictLabel || responseData.predict_label || responseData.result || "Không xác định";
    
    let confidence = responseData.confidence || responseData.confidence_score || responseData.confidenceScore || 0;
    // Chuyển đổi sang % nếu giá trị <= 1 (ví dụ: 0.6476 -> 64.76)
    if (confidence <= 1) {
      confidence = parseFloat(confidence) * 100;
    }
    // Làm tròn 2 chữ số thập phân
    confidence = parseFloat(confidence).toFixed(2);

    const explanation = responseData.explanation || responseData.qwen_reasoning || "Không có giải thích chi tiết.";

    // 2. Lưu vào MySQL
    const newCheck = await NewsCheck.create({
      userId: req.user.id,
      text: text,
      predictLabel: label,
      confidenceScore: parseFloat(confidence),
      explanation: explanation
    });

    // 3. Trả về kết quả cho frontend (Gộp dữ liệu AI gốc và dữ liệu DB để App Mobile dùng)
    res.json({ 
      success: true, 
      data: {
        ...responseData,
        ...newCheck.toJSON()
      }
    });
  } catch (err) {
    console.error('Error predicting:', err.message);
    res.status(500).json({ success: false, message: 'Lỗi khi kết nối với AI Server' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const checks = await NewsCheck.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: checks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCheck = async (req, res) => {
  try {
    const check = await NewsCheck.findByPk(req.params.id);
    if (!check) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch sử' });
    }
    // Đảm bảo user chỉ được xóa check của chính mình
    if (check.userId !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Không có quyền xóa' });
    }

    await check.destroy();
    res.json({ success: true, message: 'Đã xóa thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
