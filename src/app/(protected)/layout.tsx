import ProtectedRoute from '../../components/ProtectedRoutes';

/**
 * ProtectedLayout component to wrap protected routes.
 * Ensures that only authenticated users can access the enclosed children.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render within the protected layout
 * @returns {JSX.Element} The wrapped children inside the ProtectedRoute component
 */

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
