export interface LoginRequest {
    email: string;
    password: string;
}


export interface RegisterRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface RegisterStep1Data {
    email: string;
    password: string;
}

export interface RegisterStep2Data {
    name: string;
    username: string;
}

export interface RegisterTemplateData {
    templateId: string | null;
}

export interface CompleteRegistrationData {
    email: string;
    password: string;
    name: string;
    username: string;
    templateId?: string | null;
}


export interface AuthResponse {
    id: string;
    name: string;
    username: string;
    email: string;
    token: string;
}

export interface ErrorResponse {
    message: string;
    stack?: string;
}


export interface AuthState {
    user: AuthResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}



export interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    registerStep1: (data: RegisterStep1Data) => void;
    registerStep2: (data: RegisterStep2Data) => void;
    registerStep3: (data: RegisterTemplateData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateAuthUser: (user: AuthResponse) => void;
}


export interface LoginFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export interface RegisterFormProps {
    onSuccess?: () => void;
}

export interface RegisterStep2Props {
    onBack?: () => void;
    onSuccess?: () => void;
}

export interface RegisterStep3Props {
    onBack?: () => void;
    onSkip?: () => void;
}

export interface AuthToggleProps {
    mode: 'login' | 'register';
    onToggle: (mode: 'login' | 'register') => void;
}


export interface ValidationErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    username?: string;
    general?: string;
}


export interface RegisterSessionData {
    email: string;
    password: string;
    name?: string;
    username?: string;
    templateId?: string | null;
}