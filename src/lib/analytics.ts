import posthog from 'posthog-js';

/**
 * Type for analytics properties
 */
type AnalyticsProperties = {
  [key: string]: string | number | boolean | null | undefined | AnalyticsProperties;
};

/**
 * Utility functions for PostHog analytics
 */
export const Analytics = {
  /**
   * Track a page view
   * @param url The URL of the page
   * @param props Additional properties to include with the event
   */
  trackPageView: (url: string, props: AnalyticsProperties = {}) => {
    posthog.capture('$pageview', {
      $current_url: url,
      ...props,
    });
  },

  /**
   * Track a user action
   * @param eventName The name of the event
   * @param props Additional properties to include with the event
   */
  trackEvent: (eventName: string, props: AnalyticsProperties = {}) => {
    posthog.capture(eventName, props);
  },

  /**
   * Identify a user
   * @param userId The user ID
   * @param traits Additional user properties
   */
  identifyUser: (userId: string, traits: AnalyticsProperties = {}) => {
    posthog.identify(userId, traits);
  },

  /**
   * Reset the current user
   */
  resetUser: () => {
    posthog.reset();
  },

  /**
   * Register persistent properties that will be sent with every event
   * @param props Properties to register
   */
  registerProps: (props: AnalyticsProperties) => {
    posthog.register(props);
  },

  /**
   * Enable or disable tracking based on user consent
   * @param enabled Whether tracking should be enabled
   */
  setTrackingEnabled: (enabled: boolean) => {
    if (enabled) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  },
};

export default Analytics; 