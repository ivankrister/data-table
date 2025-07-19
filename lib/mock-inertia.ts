// Mock implementations for Inertia.js dependencies
// This allows the data-table to work without Inertia.js

export const router = {
  get: (url: string, data?: any, options?: any) => {
    console.warn('Mock Inertia router.get called. In a real application, this would navigate to:', url, 'with data:', data);
    // In a real implementation, you might want to use Next.js router or React Router here
    // For now, we'll just log the call
  }
};

export const route = (name: string, params?: any) => {
  console.warn('Mock route function called with:', name, params);
  // In a real implementation, this would generate URLs based on route names
  // For now, we'll return a placeholder URL
  return `/mock-route/${name}`;
};

// Global declarations to make these available without imports
declare global {
  var router: typeof router;
  var route: typeof route;
}

// Make them globally available (for compatibility with existing code)
if (typeof window !== 'undefined') {
  (window as any).router = router;
  (window as any).route = route;
}
