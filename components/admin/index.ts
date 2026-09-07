// Centralized export of all shared admin components
// Per 11-admin-components.md
// Makes it easy for modules to import components consistently

export { PageHeader } from './layout/PageHeader';
export { PageTitle } from './layout/PageTitle';
export { PageDescription } from './layout/PageDescription';
export { DataTable } from './table/DataTable';
export { SearchBox } from './search/SearchBox';
export { StatusBadge } from './display/StatusBadge';
export { ConfirmDialog } from './dialog/ConfirmDialog';
export { FileUploader } from './upload/FileUploader';
export { EmptyState } from './states/EmptyState';
export { LoadingState } from './states/LoadingState';
export { ErrorState } from './states/ErrorState';

// Form components
export { FormActions, FormSection } from './form';

// Layout components
export { AdminHeader } from './layout/AdminHeader';
export { AdminSidebar } from './layout/AdminSidebar';
export { Section } from './layout/Section';
export { AdminLayoutProvider } from './layout/AdminLayoutProvider';
export { AdminShell } from './layout/AdminShell';

// Shared primitives
export { ActionBar } from './shared/ActionBar';
export { ContentContainer } from './shared/ContentContainer';
export { SectionCard } from './shared/SectionCard';

// Note: Components to be implemented in Phase 4:
// - Pagination (standalone pagination control)
// - Toast system (Sonner integration)
// - Enhanced SearchFilterBar (with filter controls)
