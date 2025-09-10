
// @ts-nocheck
import { Button } from '@/components/ui/button';

interface AuthToggleProps {
  isLogin: boolean;
  onClick: () => void;
}

const AuthToggle = ({ isLogin, onClick }: AuthToggleProps) => {
  return (
    <div className="text-center">
      <Button
        variant="link"
        onClick={onClick}
        className="text-sm"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </Button>
    </div>
  );
};

export default AuthToggle;
