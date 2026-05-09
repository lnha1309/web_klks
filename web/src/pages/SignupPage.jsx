import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !passwordConfirm) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (password !== passwordConfirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    
    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Đăng ký thành công');
      navigate('/');
    } else {
      toast.error('Đăng ký thất bại: ' + result.error);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Đăng ký - Phát hiện tin giả</title>
        <meta name="description" content="Tạo tài khoản mới" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
            <CardDescription className="text-center">
              Tạo tài khoản để sử dụng đầy đủ tính năng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 text-gray-900"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự</p>
              </div>
              <div>
                <Label htmlFor="passwordConfirm">Xác nhận mật khẩu</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-1 text-gray-900"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default SignupPage;