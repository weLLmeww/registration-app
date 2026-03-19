import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api.ts';
import type { AxiosError } from 'axios';

interface FormData {
  email: string;
  name: string;
  password: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const LATIN_PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Необходимо указать e-mail';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Неверный формат e-mail';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    } else if (!LATIN_PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = 'Допускаются только латинские буквы и символы';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleUsers = () => {
    navigate('/users');
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setServerError('');

    try {
      await registerUser({
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setServerError(
        axiosErr.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 1) handleNext();
      else handleSubmit();
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="animate-fadeInUp text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/15 flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Регистрация завершена!</h2>
          <p className="text-text-muted">Перенаправление на список пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] px-4">
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Card */}
        <div className="bg-surface/60 backdrop-blur-md border border-border/60 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <h1 className="text-4xl font-bold mb-8 font-sans tracking-normal text-center subpixel-antialiased">
            {step === 1 ? 'Регистрация' : 'Детали аккаунта'}
          </h1>

          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fadeInUp flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="animate-slideInRight" onKeyDown={handleKeyDown}>
              <label className="block mb-2 text-sm font-medium text-text-muted">
                Корпоративный e-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({});
                }}
                placeholder="Введи почту..."
                autoFocus
                className={`w-full px-4 py-3 rounded-xl bg-midnight border text-text placeholder-text-muted/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/40 ${
                  errors.email ? 'border-error animate-shake' : 'border-border focus:border-accent'
                }`}
              />
              
              {errors.email && (
                <div className="mt-2.5 flex items-center gap-2 text-sm text-error animate-fadeInUp">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}

              <label>
                <input 
                  type="checkbox" 
                  name="acceptance" 
                  value="acceptance"
                  className="mr-2 mt-5 py-3 rounded-xs bg-accent hover:bg-accent-hover text-white "
                />
                Я подтверждаю согласие с <a href="#" className="text-accent hover:underline">политикой конфиденциальности</a>
              </label>
              
              <button
                onClick={handleNext}
                className="mt-6 w-full py-3 rounded-xs bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all duration-500 hover:shadow-lg hover:shadow-accent/15 active:scale-[0.98] cursor-pointer"
              >
                Продолжить
              </button>
              <button
                onClick={handleUsers}
                className="mt-3 w-full py-3 rounded-xs bg-gray hover:bg-gray-hover text-black font-semibold text-sm transition-all duration-500 hover:shadow-lg hover:shadow-accent/10 active:scale-[0.98] cursor-pointer"
              >
                Войти
              </button>
            </div>
          )}

          {/* Step 2: Name & Password */}
          {step === 2 && (
            <div className="animate-slideInRight" onKeyDown={handleKeyDown}>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-text-muted">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Ваше имя... "
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl bg-midnight border text-text placeholder-text-muted/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/40 ${
                    errors.name ? 'border-error animate-shake' : 'border-border focus:border-accent'
                  }`}
                />
                {errors.name && (
                  <div className="mt-2.5 flex items-center gap-2 text-sm text-error animate-fadeInUp">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-text-muted">
                  Пароль
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Введите пароль..."
                  className={`w-full px-4 py-3 rounded-xl bg-midnight border text-text placeholder-text-muted/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/40 ${
                    errors.password ? 'border-error animate-shake' : 'border-border focus:border-accent'
                  }`}
                />
                {errors.password && (
                  <div className="mt-2.5 flex items-center gap-2 text-sm text-error animate-fadeInUp">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-text-muted/40 font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-2 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Создание...
                    </span>
                  ) : (
                    'Создать аккаунт'
                  )}
                </button>
              </div>
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
}
