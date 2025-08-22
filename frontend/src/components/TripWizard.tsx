import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
  }>;
  isComplete: (data: any) => boolean;
}

interface TripWizardProps {
  steps: Step[];
  initialData?: any;
  onComplete: (data: any) => void;
  onCancel?: () => void;
}

const TripWizard: React.FC<TripWizardProps> = ({
  steps,
  initialData = {},
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);

  const updateData = (newData: any) => {
    setData({ ...data, ...newData });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStepData.isComplete(data);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;


            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 font-medium text-sm
                      ${isCompleted 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : isCurrent 
                        ? 'border-blue-600 text-blue-600 bg-white' 
                        : 'border-gray-300 text-gray-500 bg-white'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {currentStepData.description}
              </p>
            </div>
            <Badge variant="primary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <currentStepData.component
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <div>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {!isFirstStep && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={nextStep}
            disabled={!canProceed}
            loading={false}
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Trip
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripWizard;
