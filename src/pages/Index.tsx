
import { useAuth } from '@/hooks/useAuth';
import AuthenticatedApp from '@/components/AuthenticatedApp';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Always show the main app, regardless of authentication status
  return <AuthenticatedApp isAuthenticated={!!user} />;
};

export default Index;
