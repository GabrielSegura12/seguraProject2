import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/themes';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (isRegistering) {
      const result = await register({ username, email, password, full_name: fullName });
      if (result.success) {
        alert('Usuario registrado exitosamente. Ahora inicia sesión.');
        setIsRegistering(false);
        setEmail('');
        setFullName('');
        setUsername('');
        setPassword('');
      } else {
        setError(result.error);
      }
    } else {
      const result = await login(username, password);
      if (result.success) {
        // Redirigir directamente al módulo de predicción después del login exitoso
        navigate('/prediction');
      } else {
        setError(result.error);
      }
    }
  };

  // Si el usuario ya está autenticado, redirigir al módulo de predicción
  if (user) {
    navigate('/prediction');
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
    }}>
      {/* Lado izquierdo - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.colors.primary.gradient,
        color: theme.colors.text.white,
        padding: theme.spacing.xl,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animación de fondo */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${theme.colors.overlay.light} 0%, transparent 70%)`,
          animation: 'pulse 8s ease-in-out infinite',
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <h1 style={{
            fontSize: theme.typography.sizes['4xl'],
            marginBottom: theme.spacing.md,
            fontWeight: theme.typography.weights.bold,
          }}>
            Bienvenido
          </h1>
          <p style={{
            fontSize: theme.typography.sizes.lg,
            opacity: 0.9,
            lineHeight: 1.6,
          }}>
            {isRegistering 
              ? 'Crea tu cuenta y comienza a usar nuestra plataforma' 
              : 'Inicia sesión para acceder al módulo de predicción'}
          </p>
          <div style={{
            marginTop: theme.spacing.xl,
            opacity: 0.7,
            fontSize: theme.typography.sizes.sm,
          }}>
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        background: theme.colors.background.primary,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: theme.colors.background.secondary,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.colors.shadow.dark,
        }}>
          <h2 style={{
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
          }}>
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p style={{
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xl,
          }}>
            {isRegistering 
              ? 'Completa tus datos para registrarte' 
              : 'Ingresa tus credenciales para continuar'}
          </p>
          
          {error && (
            <div style={{
              background: theme.colors.error.background,
              color: theme.colors.error.main,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.sizes.sm,
              border: `1px solid ${theme.colors.error.border}`,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <StyledInput
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />

            {isRegistering && (
              <>
                <StyledInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@example.com"
                  required
                />
                <StyledInput
                  label="Nombre Completo"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </>
            )}

            <StyledInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <StyledButton
              type="submit"
              variant="primary"
              fullWidth
              style={{ marginTop: theme.spacing.md }}
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </StyledButton>

            <StyledButton
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              style={{ marginTop: theme.spacing.sm }}
            >
              {isRegistering 
                ? '← Volver a Iniciar Sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </StyledButton>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Login;