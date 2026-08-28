import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import CourseMainContent from '../components/CourseMainContent';
import CourseCategoryMainContent from '@/features/course-categories/components/CourseCategoryMainContent';
import CourseSectionMainContent from '@/features/course-sections/components/CourseSectionMainContent';
import TabsSections from '@/components/TabsSections';

export const CoursePage: React.FC = () => {
    return (
        <AdminLayout>
            <TabsSections 
                tabObjects={[
                    { trigger: 'Course List', content: <CourseMainContent /> },
                    { trigger: 'Course Sections', content: <CourseSectionMainContent /> },
                    { trigger: 'Course Categories', content: <CourseCategoryMainContent /> },
                ]}
            />
        </AdminLayout>
    );
};
