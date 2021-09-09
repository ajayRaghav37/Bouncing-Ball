' The Basic Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234237

''' <summary>
''' A basic page that provides characteristics common to most applications.
''' </summary>
''' 

Public NotInheritable Class MainPage
    Inherits Common.LayoutAwarePage
    Dim XPosition As Double
    Dim YPosition As Double
    Dim Slope As Double
    Dim Y As Double
    Dim X As Double
    Dim balls() As Integer
    Dim TotalBalls As Integer
    Dim DefaultMargin As Thickness
    Dim ab As New Image
    Dim Score As Integer
    Dim StackString(0 To 100) As String
    Dim BallStack(1000) As Integer
    Dim RemovingBalls(200) As Integer
    Dim RemovingBallCount As Integer
    Dim Top As Integer
    Dim Level As Integer
    Dim Droping As Boolean
    Dim ColorBall As Integer
    Dim WithEvents StageTimer As DispatcherTimer = New DispatcherTimer
    Dim WithEvents objTimer As DispatcherTimer = New DispatcherTimer
    ''' <summary>
    ''' Populates the page with content passed during navigation.  Any saved state is also
    ''' provided when recreating a page from a prior session.
    ''' </summary>
    ''' <param name="navigationParameter">The parameter value passed to
    ''' <see cref="Frame.Navigate"/> when this page was initially requested.
    ''' </param>
    ''' <param name="pageState">A dictionary of state preserved by this page during an earlier
    ''' session.  This will be null the first time a page is visited.</param>
        Protected Overrides Sub LoadState(navigationParameter As Object, pageState As Dictionary(Of String, Object))
        IsPaused = True
    End Sub

    Private Sub Grid_PointerMoved_1(sender As Object, e As PointerRoutedEventArgs)
        Dim p1 As Windows.UI.Input.PointerPoint
        Dim RotateAngle As RotateTransform
        Dim angle As Double
        Y = CurrentBall.Margin.Top + CurrentBall.height / 2
        X = CurrentBall.Margin.Left + CurrentBall.width / 2
        p1 = e.GetCurrentPoint(sender)
        angle = Math.Atan2(Y - p1.Position.Y, X - p1.Position.X) * (180 / Math.PI)
        If angle >= 5 And angle < 175 Then
            RotateAngle = New RotateTransform
            RotateAngle.Angle = angle
            Launcher.RenderTransform = RotateAngle
            XPosition = p1.Position.X
            YPosition = p1.Position.Y
            Slope = (Y - p1.Position.Y) / (p1.Position.X - X)
        End If
    End Sub

    Private Async Sub Grid1_PointerPressed_1(sender As Object, e As PointerRoutedEventArgs)
        Dim NewMargin As Thickness
        Dim X1 As Double
        Dim Y1 As Double
        Dim i As Integer
        Dim Slope1 As Double
        Dim XYZ As Boolean
        Dim j, k As Integer

        Dim Sign As Integer
        Dim OBJ As New Image
        Dim OBJ1 As New Image

        X1 = X
        Y1 = Y
        Slope1 = Slope
        If Slope1 < 0 Then
            Sign = -1
        Else
            Sign = 1
        End If
        Do
            Await Task.Delay(1)
            If CurrentBall.Margin.Top > TopLine.Margin.Top + 10 Then
                For i = 0 To 20
                    'Await Task.Delay(1)
                    If CurrentBall.Margin.Top > TopLine.Margin.Top + 10 Then
                        If CurrentBall.Margin.Left <= 0 Or CurrentBall.Margin.Left + CurrentBall.Width >= grid1.width - 20 Then
                            Slope1 = -1 * Slope1
                            Sign = -1 * Sign
                            Y1 = CurrentBall.Margin.Top + CurrentBall.Height / 2
                            X1 = CurrentBall.Margin.Left + CurrentBall.Width / 2
                        End If
                        NewMargin = CurrentBall.Margin
                        NewMargin.Top = CurrentBall.Margin.Top - 2
                        NewMargin.Left = X1 - CurrentBall.Height / 2 + ((1 / Slope1) * (-NewMargin.Top + Y1 - CurrentBall.Width / 2))

                        CurrentBall.Margin = NewMargin
                        For j = 0 To TotalBalls - 1
                            OBJ.Margin = GetBall(j).Margin
                            OBJ.Height = GetBall(j).Height
                            OBJ.Width = GetBall(j).Width
                            If CurrentBall.Margin.Top >= OBJ.Margin.Top + 10 Then
                                If CurrentBall.Margin.Top <= OBJ.Margin.Top + OBJ.Height Then
                                    If CurrentBall.Margin.Left <= OBJ.Margin.Left + OBJ.Width Then
                                        If CurrentBall.Margin.Left + CurrentBall.Width >= OBJ.Margin.Left Then
                                            XYZ = True
                                            If CurrentBall.Margin.Left <= OBJ.Margin.Left - (3 / 4) * OBJ.Width Then
                                                XYZ = False
                                                For k = 0 To TotalBalls - 1
                                                    OBJ1.Margin = GetBall(k).Margin
                                                    OBJ1.Height = GetBall(k).Height
                                                    If OBJ.Margin.Top = OBJ1.Margin.Top Then
                                                        If OBJ.Margin.Left > OBJ1.Margin.Left Then
                                                            If OBJ.Margin.Left - OBJ.Width * 2 < OBJ1.Margin.Left Then
                                                                XYZ = True
                                                            End If
                                                        End If
                                                    End If
                                                Next k
                                                NewMargin.Left = OBJ.Margin.Left - OBJ.Width
                                            ElseIf CurrentBall.Margin.Left >= OBJ.Margin.Left + OBJ.Width * (3 / 4) Then
                                                XYZ = False
                                                For k = 0 To TotalBalls - 1
                                                    OBJ1.Margin = GetBall(k).Margin
                                                    OBJ1.Height = GetBall(k).Height
                                                    If OBJ.Margin.Top = OBJ1.Margin.Top Then
                                                        If OBJ.Margin.Left < OBJ1.Margin.Left Then
                                                            If OBJ.Margin.Left + OBJ.Width * 2 > OBJ1.Margin.Left Then
                                                                XYZ = True
                                                            End If
                                                        End If
                                                    End If
                                                Next k
                                                NewMargin.Left = OBJ.Margin.Left + OBJ.Width
                                            End If
                                            NewMargin.Top = OBJ.Margin.Top
                                            If XYZ = True Then
                                                If CurrentBall.Margin.Left + CurrentBall.Width >= OBJ.Margin.Left + OBJ.Width Then
                                                    NewMargin.Left = OBJ.Margin.Left + OBJ.Width / 2
                                                Else
                                                    NewMargin.Left = OBJ.Margin.Left - OBJ.Width / 2
                                                End If
                                                NewMargin.Top = OBJ.Margin.Top + (3.5 / 4) * OBJ.Height
                                            End If
                                            CurrentBall.Margin = NewMargin
                                            Exit Do
                                        End If
                                    End If
                                End If
                            End If
                        Next j
                    Else
                        Exit For
                    End If
                Next i
            Else
                Exit Do
            End If
        Loop
        If CurrentBall.Margin.Top < TopLine.Margin.Top + 10 Then
            NewMargin.Top = TopLine.Margin.Top + 10
            For i = 0 To 22
                If CurrentBall.Margin.Left < i * CurrentBall.Width And CurrentBall.Margin.Left >= i * CurrentBall.Width - CurrentBall.Width / 2 Then
                    NewMargin.Left = i * CurrentBall.Width
                    Exit For
                ElseIf CurrentBall.Margin.Left < i * CurrentBall.Width And CurrentBall.Margin.Left >= i * CurrentBall.Width - CurrentBall.Width Then
                    NewMargin.Left = (i - 1) * CurrentBall.Width
                    Exit For
                End If
            Next i
            CurrentBall.Margin = NewMargin
        End If
        GetBall(TotalBalls).Source = CurrentBall.Source
        GetBall(TotalBalls).Margin = CurrentBall.Margin
        GetBall(TotalBalls).Tag = CurrentBall.Tag
        Top = -1
        Await Task.Delay(1)
        PushStack(TotalBalls)
        RemoveBalls()
        GetCurrentBall()
        TotalBalls = TotalBalls + 1
        MakeAllSet()
    End Sub
    Private Sub PushStack(BallNo As Integer)
        Top = Top + 1
        BallStack(Top) = BallNo
    End Sub
    Private Async Sub DropUnwantedBalls()
        Dim AttachedBall(100) As Integer
        Dim TopAttachedBall As Integer
        Dim DropBall(100) As Integer
        Dim TopDropBall As Integer
        Dim BallNo As Integer
        Dim Temp As New Image
        Dim OBJ As New Image
        'Dim Drop As Boolean
        Dim i As Integer
        Dim k As Integer
        Dim Thick As Thickness
        Dim min As Integer
        Dim CheckedBall(2000) As Integer
        Dim CheckedBall2(2000) As Integer
        RemovingBallCount = 0
        Top = -1
        TopAttachedBall = -1
        For i = 0 To TotalBalls - 1
            If GetBall(i).Margin.Top = TopLine.Margin.Top + 10 Then
                RemovingBalls(i) = i
                RemovingBallCount = RemovingBallCount + 1
                PushStack(i)
            End If
        Next i
        Do While Top <> -1
            BallNo = PopStack()
            For i = 0 To RemovingBallCount - 1
                If RemovingBalls(i) = BallNo Then
                    Exit For
                End If
            Next i
            If i = RemovingBallCount Then
                RemovingBalls(i) = BallNo
                RemovingBallCount = RemovingBallCount + 1
            End If
            Temp.Tag = GetBall(BallNo).Tag
            Temp.Width = GetBall(BallNo).Width
            Temp.Height = GetBall(BallNo).Height
            Temp.Margin = GetBall(BallNo).Margin
            For k = 0 To TotalBalls - 1
                Do
                    For i = 0 To RemovingBallCount - 1
                        If RemovingBalls(i) = k Then
                            Exit For
                        End If
                    Next i
                    If i <> RemovingBallCount Then
                        k = k + 1
                        If k = TotalBalls Then
                            Exit For
                        End If
                    Else
                        Exit Do
                    End If
                Loop
                OBJ.Tag = GetBall(k).Tag
                OBJ.Margin = GetBall(k).Margin
                OBJ.Height = GetBall(k).Height
                OBJ.Width = GetBall(k).Width
                OBJ.Name = GetBall(k).Name
                If OBJ.Margin.Left >= Temp.Margin.Left - Temp.Width - 10 And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top = Temp.Margin.Top Then
                    PushStack(k)
                ElseIf OBJ.Margin.Left <= Temp.Margin.Left + Temp.Width + 10 And OBJ.Margin.Left > Temp.Margin.Left And OBJ.Margin.Top = Temp.Margin.Top Then
                    PushStack(k)
                ElseIf OBJ.Margin.Left >= Temp.Margin.Left - Temp.Width And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top < Temp.Margin.Top And OBJ.Margin.Top >= Temp.Margin.Top - Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Margin.Left >= Temp.Margin.Left - Temp.Width And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top > Temp.Margin.Top And OBJ.Margin.Top <= Temp.Margin.Top + Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Margin.Left <= Temp.Margin.Left + Temp.Width And OBJ.Margin.Left > Temp.Margin.Left And OBJ.Margin.Top < Temp.Margin.Top And OBJ.Margin.Top >= Temp.Margin.Top - Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Margin.Left <= Temp.Margin.Left + Temp.Width And OBJ.Margin.Left >= Temp.Margin.Left And OBJ.Margin.Top > Temp.Margin.Top And OBJ.Margin.Top <= Temp.Margin.Top + Temp.Width Then
                    PushStack(k)
                End If
            Next k
        Loop
        TopDropBall = -1
        For i = 0 To TotalBalls - 1
            For k = 0 To RemovingBallCount - 1
                If i = RemovingBalls(k) Then
                    Exit For
                End If
            Next k
            If k = RemovingBallCount Then
                TopDropBall = TopDropBall + 1
                DropBall(TopDropBall) = i
            End If
        Next i
        If TopDropBall >= 0 Then
            Droping = True
            Score = Score + (TopDropBall + 1) * 2
            a.Text = "Level " + CStr(Level) + " Score " + CStr(Score)
            min = NextBall.Margin.Top
            Do While min < NextBall.Margin.Top + 150
                Await Task.Delay(1)
                min = NextBall.Margin.Top + 150
                For i = 0 To TopDropBall
                    Thick = GetBall(DropBall(i)).Margin
                    Thick.Top = Thick.Top + 10
                    If Thick.Top > NextBall.Margin.Top + 200 Then
                        Thick.Left = -800
                        Thick.Top = 900
                    End If
                    GetBall(DropBall(i)).Margin = Thick
                    If Thick.Top < min Then
                        min = Thick.Top
                    End If
                Next i
            Loop
        End If
        MakeAllSet()
        Droping = False
    End Sub
    Private Async Sub RemoveBalls()
        Dim ballno As Integer
        Dim Temp As New Image
        Dim i As Integer
        Dim tempThick As Thickness
        Dim k As Integer
        Dim OBJ As New Image

        RemovingBallCount = 0
        Do While Top <> -1
            ballno = PopStack()
            For i = 0 To RemovingBallCount - 1
                If RemovingBalls(i) = ballno Then
                    Exit For
                End If
            Next i
            If i = RemovingBallCount Then
                RemovingBalls(i) = ballno
                RemovingBallCount = RemovingBallCount + 1
            End If
            Temp.Tag = GetBall(ballno).Tag
            Temp.Width = GetBall(ballno).Width
            Temp.Height = GetBall(ballno).Height
            Temp.Margin = GetBall(ballno).Margin
            For k = 0 To TotalBalls - 1
                Do
                    For i = 0 To RemovingBallCount - 1
                        If RemovingBalls(i) = k Then
                            Exit For
                        End If
                    Next i
                    If i <> RemovingBallCount Then
                        k = k + 1
                        If k = TotalBalls Then
                            Exit For
                        End If
                    Else
                        Exit Do
                    End If
                Loop
                OBJ.Tag = GetBall(k).Tag
                OBJ.Margin = GetBall(k).Margin
                OBJ.Height = GetBall(k).Height
                OBJ.Width = GetBall(k).Width
                OBJ.Name = GetBall(k).Name
                If OBJ.Tag = Temp.Tag And OBJ.Margin.Left >= Temp.Margin.Left - Temp.Width - 10 And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top = Temp.Margin.Top Then
                    PushStack(k)
                ElseIf OBJ.Tag = Temp.Tag And OBJ.Margin.Left <= Temp.Margin.Left + Temp.Width + 10 And OBJ.Margin.Left > Temp.Margin.Left And OBJ.Margin.Top = Temp.Margin.Top Then
                    PushStack(k)
                ElseIf OBJ.Tag = Temp.Tag And OBJ.Margin.Left > Temp.Margin.Left - Temp.Width And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top < Temp.Margin.Top And OBJ.Margin.Top > Temp.Margin.Top - Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Tag = Temp.Tag And OBJ.Margin.Left > Temp.Margin.Left - Temp.Width And OBJ.Margin.Left < Temp.Margin.Left And OBJ.Margin.Top > Temp.Margin.Top And OBJ.Margin.Top < Temp.Margin.Top + Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Tag = Temp.Tag And OBJ.Margin.Left < Temp.Margin.Left + Temp.Width And OBJ.Margin.Left > Temp.Margin.Left And OBJ.Margin.Top < Temp.Margin.Top And OBJ.Margin.Top > Temp.Margin.Top - Temp.Width Then
                    PushStack(k)
                ElseIf OBJ.Tag = Temp.Tag And OBJ.Margin.Left < Temp.Margin.Left + Temp.Width And OBJ.Margin.Left > Temp.Margin.Left And OBJ.Margin.Top > Temp.Margin.Top And OBJ.Margin.Top < Temp.Margin.Top + Temp.Width Then
                    PushStack(k)
                End If
            Next k
        Loop
        If RemovingBallCount >= 3 Then
            For i = 0 To RemovingBallCount - 1
                tempThick.Left = -800
                GetBall(RemovingBalls(i)).Margin = tempThick
            Next i
            Score = Score + i
            a.Text = "Level " + CStr(Level) + " Score " + CStr(Score)
            MakeAllSet()
            Await Task.Delay(1)
            DropUnwantedBalls()
            MakeAllSet()
            If TotalBalls = 0 Then
                CreateNextStage()
            End If
        End If

    End Sub

    Private Sub GetCurrentBall()
        Dim Randomizer As New Random
        Dim i As Integer
        Dim j As Integer
        Dim x As Thickness
        Dim PresentColor(0 To 5) As String
        Dim TopPresentColor As Integer
        x = NextBall.Margin
        CurrentBall.Source = NextBall.Source
        CurrentBall.Tag = NextBall.Tag
        TopPresentColor = -1
        For j = 0 To TotalBalls - 1
            For i = 0 To TopPresentColor
                If PresentColor(i) = GetBall(j).Tag Then
                    Exit For
                End If
            Next
            If i = TopPresentColor + 1 Then
                TopPresentColor = TopPresentColor + 1
                PresentColor(TopPresentColor) = GetBall(j).Tag
            End If
        Next
        i = Randomizer.Next(TopPresentColor + 1)
        i = PresentColor(i) - 1
        NextBall.Source = GetBallColor(i).Source
        NextBall.Tag = GetBallColor(i).Tag
        CurrentBall.Margin = DefaultMargin
        NextBall.Margin = x
        CurrentBall.Visibility = Windows.UI.Xaml.Visibility.Visible
        NextBall.Visibility = Windows.UI.Xaml.Visibility.Visible
    End Sub
    'Private Sub UnPause()
    '    lblCaption.Text = "GAME PAUSED" + ChrW(13) + "The current layout is not compatible with Bouncing Ball"
    '    L1.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    L2.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    PauseScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
    '    btnNewGame.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    a.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    'End Sub
    'Private Async Sub StageTimer()
    '    Do
    '        Dim i As Integer
    '        Dim k As Integer
    '        Dim thick As Thickness
    '        Await Task.Delay(900 - 50 * Level)
    '        If IsPaused = False Then
    '            If ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Visible Then
    '                ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '                a.Visibility = Windows.UI.Xaml.Visibility.Visible
    '                L1.Visibility = Windows.UI.Xaml.Visibility.Visible
    '                L2.Visibility = Windows.UI.Xaml.Visibility.Visible
    '            End If
    '            thick = TopLine.Margin
    '            thick.Top = thick.Top + 3
    '            TopLine.Margin = thick
    '            thick.Left = L1.Margin.Left
    '            L1.Margin = thick
    '            thick.Left = L2.Margin.Left
    '            L2.Margin = thick
    '            For i = 0 To TotalBalls - 1
    '                thick = GetBall(i).Margin
    '                thick.Top = thick.Top + 3
    '                GetBall(i).Margin = thick
    '                If Droping = False Then
    '                    For k = 0 To TotalBalls - 1
    '                        thick = GetBall(k).Margin
    '                        If thick.Top >= NextBall.Margin.Top - 100 And thick.Top <= NextBall.Margin.Top + 20 - 100 Then
    '                            'display score here
    '                            a.Text = "Level " + CStr(Level) + " Score " + CStr(Score) + "              Game Over"
    '                            lblCaption.Text = "                             GAME OVER" + ChrW(13) + "                               Your Score : " + CStr(Score)
    '                            L1.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '                            L2.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '                            btnNewGame.Content = "New Game"
    '                            PauseScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
    '                            Exit Sub
    '                        End If
    '                    Next k
    '                End If
    '            Next
    '        Else
    '            ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
    '            'PauseGame()
    '        End If
    '    Loop
    'End Sub
    'Private Sub PauseGame()
    '    lblCaption.Text = "GAME PAUSED" + ChrW(13) + "The current layout is not compatible with Bouncing Ball"
    '    L1.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    L2.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    PauseScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
    '    btnNewGame.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    '    a.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    'End Sub
    Private Sub CreateNextStage()
        Dim Temp As Thickness
        Dim Row As Integer
        Dim Coloum As Integer
        Dim Randomizer As New Random
        Dim i As Integer
        Dim j As Integer
        Dim thick As Thickness
        Dim x As Thickness
        Dim Shifted As Boolean
        thick = TopLine.Margin
        thick.Left = 0
        TopLine.Margin = thick
        L1.Margin = thick
        thick.Left = TopLine.ActualWidth - 150
        L2.Margin = thick
        L1.Visibility = Windows.UI.Xaml.Visibility.Visible
        L2.Visibility = Windows.UI.Xaml.Visibility.Visible
        x = NextBall.Margin
        i = Randomizer.Next(ColorBall)
        NextBall.Source = GetBallColor(i).Source
        NextBall.Tag = GetBallColor(i).Tag
        NextBall.Margin = x
        NextBall.Visibility = Windows.UI.Xaml.Visibility.Visible
        TotalBalls = 0
        DefaultMargin = CurrentBall.Margin
        Row = 0
        Coloum = 1
        Level = Level + 1
        Shifted = True
        If Level Mod 5 = 0 Then
            ColorBall = ColorBall + 1
        End If
        If ColorBall > 5 Then
            ColorBall = 5
        End If
        x.Left = TopLine.Margin.Left
        x.Top = 90
        TopLine.Margin = x
        For j = 0 To 150
            i = Randomizer.Next(ColorBall)
            GetBall(j).Source = GetBallColor(i).Source
            GetBall(j).Tag = GetBallColor(i).Tag
            TotalBalls = TotalBalls + 1
            Temp.Left = Coloum * GetBall(j).Width
            If Shifted = False Then
                Temp.Left = Temp.Left - GetBall(j).Width / 2
            End If
            Temp.Top = TopLine.Margin.Top + 10 + Row * GetBall(j).Height * (3.5 / 4)
            GetBall(j).Margin = Temp
            Coloum = Coloum + 1
            If Coloum = 18 Then
                Row = Row + 1
                If Shifted = True Then
                    Shifted = False
                    Coloum = 1
                Else
                    Shifted = True
                    Coloum = 1
                End If
            End If
            If Row = 5 Then
                Exit For
            End If
        Next j
        GetCurrentBall()
        a.Text = "Level " + CStr(Level) + " Score " + CStr(Score)
        MakeAllSet()
    End Sub
    Private Sub MakeAllSet()
        Dim UsedBalls(350) As Integer
        Dim Thick As Thickness
        Dim TopUsed As Integer
        Dim TopUnused As Integer
        Dim UnusedBalls(350) As Integer
        Dim TempBall As New Image
        Dim TempBall2 As New Image
        Dim k As Integer
        Dim i As Integer
        Dim j As Integer
        TopUsed = -1
        TopUnused = -1
        For i = 0 To 150
            TempBall.Margin = GetBall(i).Margin
            TempBall.Width = GetBall(i).Width
            If TempBall.Margin.Top >= TopLine.Margin.Top + 10 And TempBall.Margin.Top <= NextBall.Margin.Top And TempBall.Margin.Left >= -10 And TempBall.Margin.Left + TempBall.Width <= grid1.width + 100 Then
                TopUsed = TopUsed + 1
                UsedBalls(TopUsed) = i
            Else
                TopUnused = TopUnused + 1
                UnusedBalls(TopUnused) = i
            End If
        Next i
        Dim a As String

        For j = 0 To TopUsed
            a = GetBall(UsedBalls(j)).Name
            TempBall.Source = GetBall(UsedBalls(j)).Source
            TempBall.Margin = GetBall(UsedBalls(j)).Margin
            TempBall.Tag = GetBall(UsedBalls(j)).Tag
            GetBall(j).Source = TempBall.Source
            GetBall(j).Margin = TempBall.Margin
            GetBall(j).Tag = TempBall.Tag
            Thick = TempBall.Margin
            If j <> UsedBalls(j) Then
                Thick.Left = -800
            End If
            GetBall(UsedBalls(j)).Margin = Thick
        Next j
        TotalBalls = TopUsed + 1
    End Sub
    Private Function GetBall(Index As Integer) As Windows.UI.Xaml.Controls.Image
        Select Case Index
            Case 0
                GetBall = Ball0
            Case 1
                GetBall = Ball1
            Case 2
                GetBall = Ball2
            Case 3
                GetBall = Ball3
            Case 4
                GetBall = Ball4
            Case 5
                GetBall = Ball5
            Case 6
                GetBall = Ball6
            Case 7
                GetBall = Ball7
            Case 8
                GetBall = Ball8
            Case 9
                GetBall = Ball9
            Case 10
                GetBall = Ball10
            Case 11
                GetBall = Ball11
            Case 12
                GetBall = Ball12
            Case 13
                GetBall = Ball13
            Case 14
                GetBall = Ball14
            Case 15
                GetBall = Ball15
            Case 16
                GetBall = Ball16
            Case 17
                GetBall = Ball17
            Case 18
                GetBall = Ball18
            Case 19
                GetBall = Ball19
            Case 20
                GetBall = Ball20
            Case 21
                GetBall = Ball21
            Case 22
                GetBall = Ball22
            Case 23
                GetBall = Ball23
            Case 24
                GetBall = Ball24
            Case 25
                GetBall = Ball25
            Case 26
                GetBall = Ball26
            Case 27
                GetBall = Ball27
            Case 28
                GetBall = Ball28
            Case 29
                GetBall = Ball29
            Case 30
                GetBall = Ball30
            Case 31
                GetBall = Ball31
            Case 32
                GetBall = Ball32
            Case 33
                GetBall = Ball33
            Case 34
                GetBall = Ball34
            Case 35
                GetBall = Ball35
            Case 36
                GetBall = Ball36
            Case 37
                GetBall = Ball37
            Case 38
                GetBall = Ball38
            Case 39
                GetBall = Ball39
            Case 40
                GetBall = Ball40
            Case 41
                GetBall = Ball41
            Case 42
                GetBall = Ball42
            Case 43
                GetBall = Ball43
            Case 44
                GetBall = Ball44
            Case 45
                GetBall = Ball45
            Case 46
                GetBall = Ball46
            Case 47
                GetBall = Ball47
            Case 48
                GetBall = Ball48
            Case 49
                GetBall = Ball49
            Case 50
                GetBall = Ball50
            Case 51
                GetBall = Ball51
            Case 52
                GetBall = Ball52
            Case 53
                GetBall = Ball53
            Case 54
                GetBall = Ball54
            Case 55
                GetBall = Ball55
            Case 56
                GetBall = Ball56
            Case 57
                GetBall = Ball57
            Case 58
                GetBall = Ball58
            Case 59
                GetBall = Ball59
            Case 60
                GetBall = Ball60
            Case 61
                GetBall = Ball61
            Case 62
                GetBall = Ball62
            Case 63
                GetBall = Ball63
            Case 64
                GetBall = Ball64
            Case 65
                GetBall = Ball65
            Case 66
                GetBall = Ball66
            Case 67
                GetBall = Ball67
            Case 68
                GetBall = Ball68
            Case 69
                GetBall = Ball69
            Case 70
                GetBall = Ball70
            Case 71
                GetBall = Ball71
            Case 72
                GetBall = Ball72
            Case 73
                GetBall = Ball73
            Case 74
                GetBall = Ball74
            Case 75
                GetBall = Ball75
            Case 76
                GetBall = Ball76
            Case 77
                GetBall = Ball77
            Case 78
                GetBall = Ball78
            Case 79
                GetBall = Ball79
            Case 80
                GetBall = Ball80
            Case 81
                GetBall = Ball81
            Case 82
                GetBall = Ball82
            Case 83
                GetBall = Ball83
            Case 84
                GetBall = Ball84
            Case 85
                GetBall = Ball85
            Case 86
                GetBall = Ball86
            Case 87
                GetBall = Ball87
            Case 88
                GetBall = Ball88
            Case 89
                GetBall = Ball89
            Case 90
                GetBall = Ball90
            Case 91
                GetBall = Ball91
            Case 92
                GetBall = Ball92
            Case 93
                GetBall = Ball93
            Case 94
                GetBall = Ball94
            Case 95
                GetBall = Ball95
            Case 96
                GetBall = Ball96
            Case 97
                GetBall = Ball97
            Case 98
                GetBall = Ball98
            Case 99
                GetBall = Ball99
            Case 100
                GetBall = Ball100
            Case 101
                GetBall = Ball101
            Case 102
                GetBall = Ball102
            Case 103
                GetBall = Ball103
            Case 104
                GetBall = Ball104
            Case 105
                GetBall = Ball105
            Case 106
                GetBall = Ball106
            Case 107
                GetBall = Ball107
            Case 108
                GetBall = Ball108
            Case 109
                GetBall = Ball109
            Case 110
                GetBall = Ball110
            Case 111
                GetBall = Ball111
            Case 112
                GetBall = Ball112
            Case 113
                GetBall = Ball113
            Case 114
                GetBall = Ball114
            Case 115
                GetBall = Ball115
            Case 116
                GetBall = Ball116
            Case 117
                GetBall = Ball117
            Case 118
                GetBall = Ball118
            Case 119
                GetBall = Ball119
            Case 120
                GetBall = Ball120
            Case 121
                GetBall = Ball121
            Case 122
                GetBall = Ball122
            Case 123
                GetBall = Ball123
            Case 124
                GetBall = Ball124
            Case 125
                GetBall = Ball125
            Case 126
                GetBall = Ball126
            Case 127
                GetBall = Ball127
            Case 128
                GetBall = Ball128
            Case 129
                GetBall = Ball129
            Case 130
                GetBall = Ball130
            Case 131
                GetBall = Ball131
            Case 132
                GetBall = Ball132
            Case 133
                GetBall = Ball133
            Case 134
                GetBall = Ball134
            Case 135
                GetBall = Ball135
            Case 136
                GetBall = Ball136
            Case 137
                GetBall = Ball137
            Case 138
                GetBall = Ball138
            Case 139
                GetBall = Ball139
            Case 140
                GetBall = Ball140
            Case 141
                GetBall = Ball141
            Case 142
                GetBall = Ball142
            Case 143
                GetBall = Ball143
            Case 144
                GetBall = Ball144
            Case 145
                GetBall = Ball145
            Case 146
                GetBall = Ball146
            Case 147
                GetBall = Ball147
            Case 148
                GetBall = Ball148
            Case 149
                GetBall = Ball149
            Case 150
                GetBall = Ball150
            Case Else
                GetBall = New Windows.UI.Xaml.Controls.Image
        End Select
    End Function
    Private Function GetBallColor(index As Integer) As Windows.UI.Xaml.Controls.Image
        Select Case index
            Case 0
                GetBallColor = BlueBall
            Case 1
                GetBallColor = RedBall
            Case 2
                GetBallColor = GreenBall
            Case 3
                GetBallColor = YelloBall
            Case 4
                GetBallColor = PinkBall
            Case Else
                GetBallColor = New Windows.UI.Xaml.Controls.Image
        End Select
    End Function

    Private Sub btnNewGame_Click(sender As Object, e As RoutedEventArgs) Handles btnNewGame.Click
        'Write Reset Code Here
        Dim Randomizer As New Random
        Dim i As Integer
        Dim thick As Thickness
        Level = 0
        For i = 0 To 335
            thick = GetBall(i).Margin
            thick.Top = 0
            thick.Left = -800
            GetBall(i).Margin = thick
        Next i
        ColorBall = 3
        Score = 0
        Droping = False
        CreateNextStage()
        IsPaused = False
        StageTimer.Start()
        PauseScreen.Visibility = Windows.UI.Xaml.Visibility.Collapsed
    End Sub
    Private Function PopStack() As Integer
        Dim i As Integer
        i = Top
        Top = Top - 1
        PopStack = BallStack(i)
    End Function
    ''' <summary>
    ''' Preserves state associated with this page in case the application is suspended or the
    ''' page is discarded from the navigation cache.  Values must conform to the serialization
    ''' requirements of <see cref="Common.SuspensionManager.SessionState"/>.
    ''' </summary>
    ''' <param name="pageState">An empty dictionary to be populated with serializable state.</param>
    Protected Overrides Sub SaveState(pageState As Dictionary(Of String, Object))
        
    End Sub

    Private Sub MainPage_LayoutUpdated(sender As Object, e As Object) Handles Me.LayoutUpdated
        If ApplicationView.Value = ApplicationViewState.FullScreenPortrait Or ApplicationView.Value = ApplicationViewState.Snapped Then
            IsPaused = True
            '            PauseGame()
        Else
            IsPaused = False
        End If
    End Sub

    Private Sub MainPage_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        objTimer.Interval = New TimeSpan(0, 0, 0, 0, 100)
        StageTimer.Interval = New TimeSpan(0, 0, 0, 0, 850)
        objTimer.Start()
    End Sub
    Private Sub StageTimer_Tick(sender As Object, e As Object) Handles StageTimer.Tick
        Dim i As Integer
        Dim k As Integer
        Dim thick As Thickness
        StageTimer.Interval = New TimeSpan(0, 0, 0, 0, 900 - 50 * Level)
        If Not IsPaused Then
            If ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Visible Then
                ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Collapsed
                a.Visibility = Windows.UI.Xaml.Visibility.Visible
                L1.Visibility = Windows.UI.Xaml.Visibility.Visible
                L2.Visibility = Windows.UI.Xaml.Visibility.Visible
            End If
            thick = TopLine.Margin
            thick.Top = thick.Top + 3
            TopLine.Margin = thick
            thick.Left = L1.Margin.Left
            L1.Margin = thick
            thick.Left = L2.Margin.Left
            L2.Margin = thick
            For i = 0 To TotalBalls - 1
                thick = GetBall(i).Margin
                thick.Top = thick.Top + 3
                GetBall(i).Margin = thick
                If Not Droping Then
                    For k = 0 To TotalBalls - 1
                        thick = GetBall(k).Margin
                        If thick.Top >= NextBall.Margin.Top - 100 And thick.Top <= NextBall.Margin.Top + 20 - 100 Then
                            'display score here
                            a.Text = "Level " + CStr(Level) + " Score " + CStr(Score) + "              Game Over"
                            lblCaption.Text = "                             GAME OVER" + ChrW(13) + "                               Your Score : " + CStr(Score)
                            L1.Visibility = Windows.UI.Xaml.Visibility.Collapsed
                            L2.Visibility = Windows.UI.Xaml.Visibility.Collapsed
                            btnNewGame.Content = "New Game"
                            PauseScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
                            StageTimer.Stop()
                        End If
                    Next k
                End If
            Next
        Else
            ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
            'PauseGame()
        End If
    End Sub

    Private Sub objTimer_Tick(sender As Object, e As Object) Handles objTimer.Tick
        If ApplicationView.Value = ApplicationViewState.FullScreenPortrait Or ApplicationView.Value = ApplicationViewState.Snapped Then
            ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Visible
            IsPaused = True
        Else
            ErrorScreen.Visibility = Windows.UI.Xaml.Visibility.Collapsed
            IsPaused = False
        End If
    End Sub
End Class
