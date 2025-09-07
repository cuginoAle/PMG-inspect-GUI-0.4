'use client';
import React from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Could log to external service here
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('ProjectFinder ErrorBoundary caught error', error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="center" style={{ padding: '2rem' }}>
          <Flex
            direction="column"
            gap="3"
            align="center"
            style={{ maxWidth: 480, textAlign: 'center' }}
          >
            <Text size="6" weight="bold">
              Something went wrong loading projects
            </Text>
            {this.state.error && (
              <Text size="2" color="gray">
                {this.state.error.message}
              </Text>
            )}
            <Button onClick={this.handleRetry} variant="soft">
              Retry
            </Button>
          </Flex>
        </div>
      );
    }
    return this.props.children;
  }
}
