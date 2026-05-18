CREATE PROCEDURE CreateLessonsForSurah
(
    @SubjectID INT,
    @SurahID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AyatPerLesson INT;

    -- Determine ayat per lesson
    IF @SubjectID = 1     -- Tajweed
        SET @AyatPerLesson = 10;
    ELSE IF @SubjectID = 2 -- Nazra
        SET @AyatPerLesson = 20;
    ELSE IF @SubjectID = 3 -- Hifz
        SET @AyatPerLesson = 15;

    DECLARE @TotalAyat INT =
        (SELECT COUNT(*) FROM Quran WHERE SuraID = @SurahID);

    DECLARE @Start INT = 1;
    DECLARE @LessonNumber INT = 1;
    DECLARE @LessonPlanID INT;

    WHILE @Start <= @TotalAyat
    BEGIN
        -- Create Lesson Plan record
        INSERT INTO LessonPlan (lessonName)
        VALUES (
            'Surah ' + CAST(@SurahID AS VARCHAR(10)) 
            + ' - Lesson ' + CAST(@LessonNumber AS VARCHAR(10))
        );

        SET @LessonPlanID = SCOPE_IDENTITY();

        -- Insert verses into Lessons table
        INSERT INTO Lesson (LessonPlanID, QuranID, SubjectID, SurahID)
        SELECT @LessonPlanID,
               Q.ID,
               @SubjectID,
               @SurahID
        FROM Quran Q
        WHERE Q.SuraID = @SurahID
          AND Q.VerseID BETWEEN @Start AND (@Start + @AyatPerLesson - 1)
        ORDER BY Q.VerseID;

        -- Move to next lesson
        SET @Start = @Start + @AyatPerLesson;
        SET @LessonNumber = @LessonNumber + 1;
    END;
END;


drop procedure CreateLessonsForSurah




How can we call it 


DECLARE @SurahID INT = 1;

WHILE @SurahID <= 114
BEGIN
    -- Call the procedure for each Surah
    EXEC CreateLessonsForSurah 
        @SubjectID = 3,   -- Nazra (20 ayat per lesson)
        @SurahID = @SurahID;

    -- Move to next Surah
    SET @SurahID = @SurahID + 1;
END;

