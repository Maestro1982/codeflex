'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { vapi } from '@/lib/vapi';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GenerateProgramPage = () => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isCallEnded, setIsCallEnded] = useState<boolean>(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // Override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes('Meeting has ended') ||
          (args[0] && args[0].toString().includes('Meeting has ended')))
      ) {
        console.log('Ignoring known error: Meeting has ended');
        return; // Don't pass to original handler
      }

      // Pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // Restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Navigate user to profile page after the call ends
  useEffect(() => {
    if (isCallEnded) {
      const redirectTimer = setTimeout(() => {
        router.push('/profile');
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isCallEnded, router]);

  // Setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log('Call Started');
      setIsConnecting(false);
      setIsCallActive(true);
      setIsCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log('Call Ended');
      setIsCallActive(false);
      setIsConnecting(false);
      setIsAiSpeaking(false);
      setIsCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log('AI Started Speaking');
      setIsAiSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log('AI Stopped Speaking');
      setIsAiSpeaking(false);
    };

    type VapiMessage = {
      type: string;
      role: 'user' | 'assistant' | string;
      transcriptType?: 'final' | 'interim' | string;
      transcript?: string;
      [key: string]: unknown;
    };

    const handleMessage = (message: VapiMessage) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage: { content: string; role: string } = {
          content: message.transcript ?? '',
          role: message.role,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: unknown) => {
      console.log('Vapi Error', error);
      setIsConnecting(false);
      setIsCallActive(false);
    };

    vapi
      .on('call-start', handleCallStart)
      .on('call-end', handleCallEnd)
      .on('speech-start', handleSpeechStart)
      .on('speech-end', handleSpeechEnd)
      .on('message', handleMessage)
      .on('error', handleError);

    // Clean up event listeners on unmount
    return () => {
      vapi
        .off('call-start', handleCallStart)
        .off('call-end', handleCallEnd)
        .off('speech-start', handleSpeechStart)
        .off('speech-end', handleSpeechEnd)
        .off('message', handleMessage)
        .off('error', handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (isCallActive) vapi.stop();
    else {
      try {
        setIsConnecting(true);
        setMessages([]);
        setIsCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ''}`.trim()
          : 'There';

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log('Failed to start call', error);
        setIsConnecting(false);
      }
    }
  };

  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24'>
      <div className='container mx-auto px-4 h-full max-w-5xl'>
        {/* Title */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold font-mono'>
            <span>Generate Your </span>
            <span className='text-primary uppercase'>Fitness Program</span>
          </h1>
          <p className='text-muted-foreground mt-2'>
            Have a voice conversation with our AI assistant to create your
            personalized plan
          </p>
        </div>

        {/* VIDEO CALL AREA */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* AI ASSISTANT CARD */}
          <Card className='bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative'>
            <div className='aspect-video flex flex-col items-center justify-center p-6 relative'>
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isAiSpeaking ? 'opacity-30' : 'opacity-0'
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isAiSpeaking ? 'animate-sound-wave' : ''
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isAiSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : '5%',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className='relative size-32 mb-4'>
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isAiSpeaking ? 'animate-pulse' : ''
                  }`}
                />

                <div className='relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10' />
                  <Image
                    src='/ai-avatar.png'
                    alt='AI Assistant'
                    className='w-full h-full object-cover'
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <h2 className='text-xl font-bold text-foreground'>CodeFlex AI</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Fitness & Diet Coach
              </p>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isAiSpeaking ? 'border-primary' : ''
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAiSpeaking ? 'bg-primary animate-pulse' : 'bg-muted'
                  }`}
                />

                <span className='text-xs text-muted-foreground'>
                  {isAiSpeaking
                    ? 'Speaking...'
                    : isCallActive
                      ? 'Listening...'
                      : isCallEnded
                        ? 'Redirecting to profile...'
                        : 'Waiting...'}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className='aspect-video flex flex-col items-center justify-center p-6 relative'>
              {/* User Image */}
              <div className='relative size-32 mb-4'>
                <Image
                  src={user?.imageUrl || '/default_image.png'}
                  alt='User'
                  // ADD THIS "size-full" class to make it rounded on all images
                  className='size-full object-cover rounded-full'
                  width={100}
                  height={100}
                />
              </div>

              <h2 className='text-xl font-bold text-foreground'>You</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {user
                  ? (user.firstName + ' ' + (user.lastName || '')).trim()
                  : 'Guest'}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className='text-xs text-muted-foreground'>Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE CONTAINER  */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className='w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth'
          >
            <div className='space-y-3'>
              {messages.map((msg, index) => (
                <div key={index} className='message-item animate-fadeIn'>
                  <div className='font-semibold text-xs text-muted-foreground mb-1'>
                    {msg.role === 'assistant' ? 'CodeFlex AI' : 'You'}:
                  </div>
                  <p className='text-foreground'>{msg.content}</p>
                </div>
              ))}

              {isCallEnded && (
                <div className='message-item animate-fadeIn'>
                  <div className='font-semibold text-xs text-primary mb-1'>
                    System:
                  </div>
                  <p className='text-foreground'>
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className='w-full flex justify-center gap-4'>
          <Button
            className={`w-40 text-xl rounded-3xl ${
              isCallActive
                ? 'bg-destructive hover:bg-destructive/90'
                : isCallEnded
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-primary hover:bg-primary/90'
            } text-white relative`}
            onClick={toggleCall}
            disabled={isConnecting || isCallEnded}
          >
            {isConnecting && (
              <span className='absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75'></span>
            )}

            <span>
              {isAiSpeaking
                ? 'End Call'
                : isConnecting
                  ? 'Connecting...'
                  : isCallEnded
                    ? 'View Profile'
                    : 'Start Call'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default GenerateProgramPage;
