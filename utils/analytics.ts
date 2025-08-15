export const trackUserActivity = {
  tabSwitched: (fromTab: string, toTab: string) => {
    // Basic analytics tracking for tab switching
    console.log(`User switched from ${fromTab} to ${toTab}`);
    // You can integrate with your analytics service here
  },
};
