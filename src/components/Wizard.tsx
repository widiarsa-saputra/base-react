import React, { useState, ReactNode, Children, isValidElement } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WizardProps {
    children: ReactNode;
    onComplete?: () => void;
    /** Called when the user clicks "Batal" on the first step.
     *  When used inside a dialog, pass the dialog's onOpenChange(false) here. */
    onCancel?: () => void;
    className?: string;
}

export interface WizardStepProps {
    title: string;
    description?: string;
    children: ReactNode;
    /** Function to validate this step before moving to next. Return true if valid. */
    onValidate?: () => Promise<boolean> | boolean;
}

export const WizardStep: React.FC<WizardStepProps> = ({ children }) => {
    return <div className="animate-in fade-in slide-in-from-right-4 duration-300">{children}</div>;
};

export const Wizard: React.FC<WizardProps> = ({ children, onComplete, onCancel, className }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isValidating, setIsValidating] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    // Filter children to only include elements that have WizardStep props (like title)
    const steps = Children.toArray(children).filter(
        (child) => isValidElement(child) && (child.props as WizardStepProps).title
    ) as React.ReactElement<WizardStepProps>[];

    const totalSteps = steps.length;
    const activeStep = steps[currentStep];

    if (!activeStep) {
        return null;
    }

    const handleNext = async () => {
        if (!activeStep) return;
        
        if (activeStep.props.onValidate) {
            setIsValidating(true);
            const isValid = await activeStep.props.onValidate();
            setIsValidating(false);
            
            if (!isValid) return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (activeStep?.props.onValidate) {
            setIsValidating(true);
            const isValid = await activeStep.props.onValidate();
            setIsValidating(false);
            if (!isValid) return;
        }

        // Trigger external form submission
        const submitBtn = document.querySelector('.managed-form-submit-btn') as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.click();
        } else if (onComplete) {
            onComplete();
        }
    };

    const handleCancel = () => {
        // Prefer the explicit onCancel prop (e.g. closing a dialog from the outside)
        if (onCancel) {
            onCancel();
            return;
        }
        // Fallback: click the hidden ManagedForm cancel button
        const cancelBtn = document.querySelector('.managed-form-cancel-btn') as HTMLButtonElement;
        if (cancelBtn) {
            cancelBtn.click();
        }
    };

    return (
        <div className={cn("flex flex-col w-full bg-white rounded-xl shadow-sm border", className)}>
            {/* Hide external ManagedForm buttons */}
            <style>{`
                .managed-form-submit-btn, 
                .managed-form-cancel-btn, 
                .managed-form-footer {
                    display: none !important;
                }
            `}</style>

            {/* Stepper Header */}
            <div className="flex w-full p-6 border-b rounded-t overflow-x-auto">
                <div className="flex items-start min-w-max w-full">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;

                        return (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center gap-2 w-fit shrink-0">
                                    <div
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ring-4 shrink-0",
                                            isActive
                                                ? "bg-primary text-primary-foreground ring-primary/20 scale-110"
                                                : isCompleted
                                                ? "bg-green-500 text-white ring-green-500/20"
                                                : "bg-slate-100 text-slate-400 ring-transparent"
                                        )}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : index + 1}
                                    </div>
                                    <div className="flex flex-col items-center text-center px-2 max-w-[150px]">
                                        <span className={cn(
                                            "text-sm font-semibold transition-colors text-center",
                                            isActive ? "text-primary" : isCompleted ? "text-slate-700" : "text-slate-400"
                                        )}>
                                            {step.props.title}
                                        </span>
                                    </div>
                                </div>
                                {index < totalSteps - 1 && (
                                    <div className="flex-1 mx-2 h-[2px] bg-slate-200 relative mt-5 min-w-[40px]">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
                                            style={{ width: isCompleted ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 mt-6 min-h-[300px]">
                {/* Step Header */}
                <div className="mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">{activeStep.props.title}</h2>
                    {activeStep.props.description && (
                        <p className="text-muted-foreground mt-1">{activeStep.props.description}</p>
                    )}
                </div>

                {activeStep}
            </div>

            {/* Cancel confirmation dialog */}
            <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan pengisian form?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Semua data yang telah Anda isi pada seluruh langkah akan hilang. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Kembali ke Form</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleCancel}
                        >
                            Ya, Batalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-6 border-t bg-slate-50 rounded-b-xl">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={currentStep === 0 ? () => setShowCancelConfirm(true) : handlePrevious}
                    className="w-32"
                >
                    {currentStep === 0 ? 'Batal' : 'Kembali'}
                </Button>

                <div className="flex gap-2">
                    {currentStep < totalSteps - 1 ? (
                        <Button 
                            type="button" 
                            onClick={handleNext} 
                            disabled={isValidating}
                            className="w-32 bg-primary hover:bg-primary/90"
                        >
                            Selanjutnya
                        </Button>
                    ) : (
                        <Button 
                            type="button" 
                            onClick={handleSubmit} 
                            disabled={isValidating}
                            className="w-32 bg-green-600 hover:bg-green-700 text-white"
                        >
                            Simpan
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
