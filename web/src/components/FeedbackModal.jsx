import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';

const FeedbackModal = ({ isOpen, onClose, checkId }) => {
  const [actualLabel, setActualLabel] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actualLabel) {
      toast.error('Vui lòng chọn kết quả thực tế');
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackService.createFeedback(checkId, actualLabel, comment);
      if (response.success) {
        toast.success('Cảm ơn bạn đã gửi phản hồi!');
        setActualLabel('');
        setComment('');
        onClose();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gửi phản hồi</DialogTitle>
          <DialogDescription>
            Giúp AI cải thiện bằng cách cung cấp kết quả đúng cho tin tức này.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Kết quả thực tế</Label>
            <Select onValueChange={setActualLabel} value={actualLabel}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn kết quả thực tế" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REAL">Tin thật</SelectItem>
                <SelectItem value="FAKE">Tin giả</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nhận xét thêm (Tùy chọn)</Label>
            <Textarea
              placeholder="Giải thích vì sao bạn chọn kết quả này..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
