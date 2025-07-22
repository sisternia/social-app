const BASE_URL = 'http://192.168.1.7:3001/api/users';
const BASE_HOST = 'http://192.168.1.7:3001';

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { status: res.ok ? data.status : 'error', ...data };
};

export const register = async (user_name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name, email, password }),
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const verifyCode = async (code: string, action?: string) => {
  const res = await fetch(`${BASE_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, action }),
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const resetPassword = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const fetchUserInfo = async (user_id: string) => {
  const res = await fetch(`${BASE_URL}/info?user_id=${user_id}`);
  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const uploadAvatar = async (user_id: string, assetUri: string) => {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('avatar', {
    uri: assetUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${BASE_URL}/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const uploadBackground = async (user_id: string, assetUri: string) => {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('background', {
    uri: assetUri,
    name: 'background.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${BASE_URL}/background`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};

export const getImageUrl = (filename: string | null) => {
  return filename ? `${BASE_HOST}/${filename}` : null;
};

export const updateUserInfo = async (
  user_id: string,
  updates: {
    user_name: string;
    user_dob: string | null;
    user_phone: string;
    user_bio: string;
    user_add: string;
  }
) => {
  const body = {
    user_id,
    ...updates,
  };

  const res = await fetch(`${BASE_URL}/update-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { status: res.ok ? 'success' : 'error', ...data };
};
